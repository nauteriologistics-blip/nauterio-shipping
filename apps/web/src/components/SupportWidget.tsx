"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MessageCircle, Send, X } from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

interface QuickAnswer { question: string; answer: string }

export default function SupportWidget({ hasSession }: { hasSession: boolean }) {
  const t = useTranslations("SupportWidget");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<QuickAnswer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const answers = t.raw("quickAnswers") as QuickAnswer[];

  if (pathname === "/portal/support") return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const csrf = getCsrfToken();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/v1/me/support/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID(), ...(csrf ? { [CSRF_HEADER]: csrf } : {}) },
        body: JSON.stringify({ subject: data.get("subject"), message: data.get("message") }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(body?.message ?? t("sendError"));
      }
      form.reset();
      setSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("sendError"));
    } finally {
      setSending(false);
    }
  }

  return <div className="fixed bottom-5 right-5 z-[60]">
    {open && <section aria-label={t("title")} className="mb-3 w-[min(23rem,calc(100vw-2.5rem))] border border-slate-300 bg-white shadow-xl">
      <header className="flex items-start justify-between bg-[#10233f] p-5 text-white"><div><p className="font-semibold">{t("title")}</p><p className="mt-1 text-xs leading-5 text-slate-300">{t("intro")}</p></div><button onClick={() => setOpen(false)} aria-label={t("close")} className="ml-4 p-1 text-slate-300 hover:text-white"><X className="h-5 w-5" /></button></header>
      <div className="max-h-[65vh] overflow-y-auto p-4">
        {!showForm && !sent && <>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{t("commonQuestions")}</p>
          <div className="divide-y divide-slate-200 border-y border-slate-200">{answers.map((item) => <button key={item.question} onClick={() => setAnswer(item)} className="block w-full py-3 text-left text-sm font-medium text-[#10233f] hover:text-[#a95d14]">{item.question}</button>)}</div>
          {answer && <div className="mt-4 border-l-4 border-[#d77718] bg-[#f7f6f2] p-4"><p className="text-sm font-semibold text-[#10233f]">{answer.question}</p><p className="mt-2 text-sm leading-6 text-slate-600">{answer.answer}</p></div>}
          <button onClick={() => setShowForm(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#d77718] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b95f0d]"><MessageCircle className="h-4 w-4" />{t("messageTeam")}</button>
        </>}
        {showForm && !sent && (hasSession ? <form onSubmit={submit}><button type="button" onClick={() => setShowForm(false)} className="mb-4 text-sm font-semibold text-slate-500 hover:text-[#10233f]">← {t("back")}</button><label className="block text-sm font-medium text-[#10233f]">{t("subjectLabel")}<input name="subject" required maxLength={160} className="mt-2 w-full rounded-md border border-slate-300 p-3" placeholder={t("subjectPlaceholder")} /></label><label className="mt-4 block text-sm font-medium text-[#10233f]">{t("messageLabel")}<textarea name="message" required maxLength={5000} rows={5} className="mt-2 w-full rounded-md border border-slate-300 p-3" placeholder={t("messagePlaceholder")} /></label>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}<button disabled={sending} className="mt-4 flex items-center gap-2 rounded-md bg-[#10233f] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" />{sending ? t("sending") : t("send")}</button></form> : <div><button type="button" onClick={() => setShowForm(false)} className="mb-4 text-sm font-semibold text-slate-500 hover:text-[#10233f]">← {t("back")}</button><p className="text-sm leading-6 text-slate-600">{t("signInBody")}</p><Link href="/signin" className="mt-4 inline-block rounded-md bg-[#10233f] px-5 py-3 text-sm font-semibold text-white">{t("signIn")}</Link></div>)}
        {sent && <div className="py-3"><p className="font-semibold text-[#10233f]">{t("sentTitle")}</p><p className="mt-2 text-sm leading-6 text-slate-600">{t("sentBody")}</p><Link href="/portal/support" className="mt-4 inline-block font-semibold text-[#a95d14] underline">{t("openInbox")}</Link></div>}
      </div>
    </section>}
    <button onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={t("buttonLabel")} className="ml-auto flex h-14 items-center gap-2 rounded-md bg-[#10233f] px-4 font-semibold text-white shadow-lg hover:bg-[#18365e]"><MessageCircle className="h-5 w-5" /><span>{t("buttonText")}</span></button>
  </div>;
}
