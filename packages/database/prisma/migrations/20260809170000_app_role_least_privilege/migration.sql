-- DATA-015(d): the constraints migration's own header comment claims it
-- "revokes UPDATE/DELETE from the app role"; no REVOKE statement existed
-- anywhere, and no such role existed either - locally the app connects as
-- a superuser, and in the CDK-provisioned RDS instance the application
-- connects as `nauterio_admin`, the RDS *master* credential (see
-- infra/cdk/lib/data-stack.ts's `DatabaseCredentials` secret), not a
-- restricted role. A superuser and an RDS master user both bypass
-- GRANT/REVOKE entirely, so even if the REVOKE statements the comment
-- promised had been written, they would have protected nothing.
--
-- This migration creates the restricted role the comment always assumed
-- existed, and grants it real, GRANT-level enforcement of the append-only
-- invariant as defence-in-depth alongside the BEFORE UPDATE/DELETE
-- triggers - two independent mechanisms, not one dressed up as two.
--
-- `IF NOT EXISTS`-style idempotency via a DO block, since Postgres has no
-- native `CREATE ROLE IF NOT EXISTS`.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nauterio_app') THEN
    CREATE ROLE nauterio_app LOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO nauterio_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO nauterio_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO nauterio_app;

-- The actual append-only enforcement: nauterio_app never receives UPDATE or
-- DELETE on these five tables at all (not granted-then-revoked - never
-- granted), matching the BEFORE UPDATE/DELETE triggers already in place.
-- outbox_events is the one documented exception (see the constraints
-- migration's own comment): its rows are legitimately updated by the relay
-- process (status/attempts/publishedAt), so only DELETE is withheld.
REVOKE UPDATE, DELETE ON
  audit_events, inbox_events, payment_events, package_movements, tracking_events
FROM nauterio_app;
REVOKE DELETE ON outbox_events FROM nauterio_app;

-- On real RDS with IAM database authentication enabled, `rds_iam` is a
-- reserved role that must be granted to any DB user connecting via an IAM
-- auth token instead of a static password. It does not exist locally (no
-- real RDS), so this is conditional rather than a hard dependency of this
-- migration - see docs/runbooks/database-migrations.md for the production
-- wiring this still requires (a real password/IAM-token provisioning path
-- for nauterio_app, and switching apps/api's and apps/worker's runtime
-- connection to use it instead of the nauterio_admin master credential -
-- NOT done by this migration, which only creates the role and its
-- privileges).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rds_iam') THEN
    EXECUTE 'GRANT rds_iam TO nauterio_app';
  END IF;
END
$$;
