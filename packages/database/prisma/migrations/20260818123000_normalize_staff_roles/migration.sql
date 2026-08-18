-- Replace pre-permission-matrix seed role names with the canonical roles
-- consumed by ROLE_BASELINE_ACTIONS. Unknown role strings otherwise
-- authenticate successfully but receive no permissions.
UPDATE "users"
SET "staff_role" = 'WAREHOUSE'
WHERE "staff_role" = 'LOGISTICS_OPERATOR';

UPDATE "users"
SET "staff_role" = 'SUPER_ADMIN'
WHERE "staff_role" = 'SYSTEM_ADMINISTRATOR';
