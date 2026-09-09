"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { ApiError, apiFetch } from "@/lib/api";

type Message = { id: string; body: string; authorType: string; createdAt: string; authorUser?: { fullName: string } };
type Conversation = { id: string; subject: string; status: string; lastMessageAt: string; customerUser?: { fullName: string; email: string }; shipment?: { trackingNumber: string } | null; messages?: Message[] };

const readableStatus = (status: string) => status.toLowerCase().replaceAll("_", " ");

export default function SupportPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setItems(await apiFetch<Conversation[]>("/admin/support/conversations"));
      setError("");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not load customer conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [load]);

  async function open(id: string) {
    try {
      setActive(await apiFetch<Conversation>(`/admin/support/conversations/${id}/messages`));
      setError("");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not open this conversation.");
    }
  }

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active) return;
    const form = event.currentTarget;
    const body = String(new FormData(form).get("body") ?? "").trim();
    if (!body) return;
    setSending(true);
    try {
      await apiFetch(`/admin/support/conversations/${active.id}/messages`, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ body }) });
      form.reset();
      await Promise.all([open(active.id), load()]);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not send the reply.");
    } finally {
      setSending(false);
    }
  }

  async function resolve() {
    if (!active) return;
    try {
      await apiFetch(`/admin/support/conversations/${active.id}`, { method: "PATCH", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ status: "RESOLVED" }) });
      await Promise.all([open(active.id), load()]);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not resolve this conversation.");
    }
  }

  return <AdminShell>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="text-xl font-bold text-[#081F3D]">Customer support</h1><p className="mt-1 text-sm text-slate-500">Messages sent by signed-in customers. Replies appear in their customer portal.</p></div><button onClick={() => void load()} className="self-start rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Refresh inbox</button></div>
    {error && <p role="alert" className="mt-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
      <aside className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Inbox ({items.length})</div>
        {loading && <p className="p-4 text-sm text-slate-500">Loading conversations…</p>}
        {!loading && items.length === 0 && <p className="p-4 text-sm leading-6 text-slate-500">No customer conversations yet.</p>}
        <div className="divide-y divide-slate-200">{items.map((item) => <button key={item.id} onClick={() => void open(item.id)} className={`w-full p-4 text-left hover:bg-slate-50 ${active?.id === item.id ? "border-l-4 border-[#F28C18] bg-orange-50/40" : "border-l-4 border-transparent"}`}><span className="block truncate text-sm font-semibold text-[#081F3D]">{item.subject}</span><span className="mt-1 block truncate text-xs text-slate-500">{item.customerUser?.fullName ?? "Customer"} · {readableStatus(item.status)}</span><span className="mt-1 block text-xs text-slate-400">{new Date(item.lastMessageAt).toLocaleString()}</span></button>)}</div>
      </aside>
      <section className="min-h-[32rem] border border-slate-200 bg-white">
        {active ? <>
          <header className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row"><div><h2 className="font-bold text-[#081F3D]">{active.subject}</h2><p className="mt-1 text-sm text-slate-500">{active.customerUser?.fullName} · <a className="underline" href={`mailto:${active.customerUser?.email}`}>{active.customerUser?.email}</a>{active.shipment ? ` · ${active.shipment.trackingNumber}` : ""}</p></div><div className="flex items-center gap-3"><span className="text-xs font-semibold capitalize text-slate-500">{readableStatus(active.status)}</span><button onClick={() => void resolve()} disabled={active.status === "RESOLVED" || active.status === "CLOSED"} className="rounded-md border border-emerald-300 px-3 py-2 text-xs font-bold text-emerald-700 disabled:opacity-40">Mark resolved</button></div></header>
          <div className="min-h-80 space-y-4 p-5">{active.messages?.map((message) => <div key={message.id} className={`max-w-[82%] border-l-4 p-3 text-sm leading-6 ${message.authorType === "STAFF" ? "ml-auto border-[#F28C18] bg-slate-900 text-white" : "border-slate-300 bg-slate-50 text-slate-800"}`}><p>{message.body}</p><p className={`mt-2 text-[11px] ${message.authorType === "STAFF" ? "text-slate-400" : "text-slate-400"}`}>{message.authorType === "STAFF" ? "Nauterio" : active.customerUser?.fullName ?? "Customer"} · {new Date(message.createdAt).toLocaleString()}</p></div>)}</div>
          <form onSubmit={(event) => void reply(event)} className="flex gap-2 border-t border-slate-200 p-4"><input required name="body" maxLength={5000} disabled={sending || active.status === "CLOSED"} className="flex-1 rounded-md border border-slate-300 p-3 text-sm" placeholder="Write a reply to the customer"/><button disabled={sending || active.status === "CLOSED"} className="rounded-md bg-[#F28C18] px-5 text-sm font-bold text-white disabled:opacity-50">{sending ? "Sending…" : "Send reply"}</button></form>
        </> : <div className="flex min-h-[32rem] items-center justify-center p-8 text-center text-sm text-slate-500">Select a conversation to read it and reply.</div>}
      </section>
    </div>
  </AdminShell>;
}
