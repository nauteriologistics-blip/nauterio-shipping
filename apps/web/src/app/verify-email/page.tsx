"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { verifyEmail } from "@/lib/auth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("VerifyEmail");
  const token = searchParams.get("token");

  // No token is knowable synchronously from the URL at first render - no
  // need for an effect to discover it, which also avoids a setState call
  // directly in the effect body for that branch.
  const [status, setStatus] = useState<"checking" | "error" | "done">(token ? "checking" : "error");
  const [errorMessage, setErrorMessage] = useState(token ? "" : t("missingToken"));

  // The verification token is single-use server-side - React StrictMode's
  // dev-mode double-invoke of this effect (mount -> cleanup -> remount)
  // doesn't actually abort the first fetch, so without this guard BOTH
  // requests reach the server. The server-side race is closed separately
  // (apps/api's verifyEmail now consumes the token via an atomic
  // conditional UPDATE), but that alone isn't enough here: whichever of
  // the two requests loses the race would still overwrite this component's
  // state with an "invalid or expired" error even though the other request
  // just succeeded. `hasFired` ensures the request is only ever sent once
  // per token, regardless of how many times the effect body runs.
  const hasFired = useRef(false);

  useEffect(() => {
    if (!token || hasFired.current) return;
    hasFired.current = true;

    (async () => {
      const result = await verifyEmail(token);
      if (!result.ok) {
        setStatus("error");
        setErrorMessage(result.error);
        return;
      }
      setStatus("done");
      // The BFF route already set the session cookie on success - straight
      // to the portal, no separate sign-in step needed.
      router.push("/portal");
    })();
  }, [token, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        {status === "checking" && (
          <>
            <h1 className="text-xl font-bold text-[#081F3D]">{t("checkingTitle")}</h1>
            <p className="mt-2 text-sm text-slate-500">{t("checkingBody")}</p>
          </>
        )}
        {status === "done" && (
          <>
            <h1 className="text-xl font-bold text-[#081F3D]">{t("doneTitle")}</h1>
            <p className="mt-2 text-sm text-slate-500">{t("doneBody")}</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-[#081F3D]">{t("errorTitle")}</h1>
            <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/register" className="text-[#081F3D] font-medium hover:underline">
                {t("tryAgain")}
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
