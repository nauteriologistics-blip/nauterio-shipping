"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CSRF_COOKIE, CSRF_HEADER } from "@/lib/session";

type Conversation = { id: string; subject: string; status: string; lastMessageAt: string; messages?: Message[] };
type Message = { id: string; body: string; authorType: "CUSTOMER" | "STAFF" | "SYSTEM"; createdAt: string };
const csrf = () => decodeURIComponent(document.cookie.split("; ").find((row) => row.startsWith(`${CSRF_COOKIE}=`))?.split("=")[1] ?? "");
const statusLabel = (status: string) => status.toLowerCase().replaceAll("_", " ");

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const mutating = Boolean(init?.method && init.method !== "GET");
  const response = await fetch(`/api/v1${path}`, { ...init, headers: { "Content-Type": "application/json", ...(mutating ? { [CSRF_HEADER]: csrf(), "Idempotency-Key": crypto.randomUUID() } : {}), ...init?.headers } });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message ?? "Request failed");
  return body as T;
}

export default function CustomerSupportPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const load = useCallback(async () => { try { setItems(await api<Conversation[]>("/me/support/conversations")); setError(""); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load conversations"); } }, []);
  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [load]);

  async function open(id: string) { try { setError(""); setActive(await api<Conversation>(`/me/support/conversations/${id}/messages`)); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not open conversation"); } }
  async function create(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setSending(true); try { setError(""); const created = await api<Conversation>("/me/support/conversations", { method: "POST", body: JSON.stringify({ subject: data.get("subject"), message: data.get("message") }) }); form.reset(); await load(); await open(created.id); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not start conversation"); } finally { setSending(false); } }
  async function reply(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!active) return; const form = event.currentTarget; const data = new FormData(form); setSending(true); try { setError(""); await api(`/me/support/conversations/${active.id}/messages`, { method: "POST", body: JSON.stringify({ body: data.get("body") }) }); form.reset(); await open(active.id); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not send message"); } finally { setSending(false); } }

  return <main className="mx-auto max-w-6xl px-4 py-10 text-[#10233f]"><header className="border-b border-slate-300 pb-7"><p className="text-sm font-semibold text-[#a95d14]">Customer support</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Message the operations team</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Use this inbox for shipment questions, missing documents, delivery concerns or account help. A member of the Nauterio team will reply here.</p></header>{error && <p role="alert" className="mt-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}<div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr]"><aside><h2 className="text-sm font-semibold">Your conversations</h2><div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">{items.map((item) => <button key={item.id} onClick={() => void open(item.id)} className={`block w-full py-4 text-left ${active?.id === item.id ? "border-l-4 border-[#d77718] pl-3" : ""}`}><strong className="block text-sm">{item.subject}</strong><span className="mt-1 block text-xs capitalize text-slate-500">{statusLabel(item.status)} · {new Date(item.lastMessageAt).toLocaleDateString()}</span></button>)}{items.length === 0 && <p className="py-4 text-sm text-slate-500">No conversations yet.</p>}</div><form onSubmit={(event) => void create(event)} className="mt-8 border-t-2 border-[#10233f] pt-5"><h2 className="font-semibold">Start a conversation</h2><label className="mt-4 block text-sm font-medium">Subject<input name="subject" required maxLength={160} placeholder="What do you need help with?" className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm"/></label><label className="mt-4 block text-sm font-medium">Message<textarea name="message" required maxLength={5000} rows={5} placeholder="Include the tracking number and what happened, if this is about a shipment." className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm"/></label><button disabled={sending} className="mt-4 rounded-md bg-[#d77718] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{sending ? "Sending…" : "Send to support"}</button></form></aside><section className="min-h-[32rem] border border-slate-200 bg-white">{active ? <><header className="border-b border-slate-200 p-5"><h2 className="font-semibold">{active.subject}</h2><p className="mt-1 text-xs capitalize text-slate-500">{statusLabel(active.status)}</p></header><div className="min-h-80 space-y-4 p-5">{active.messages?.map((message) => <div key={message.id} className={`max-w-[82%] border-l-4 p-3 text-sm leading-6 ${message.authorType === "CUSTOMER" ? "ml-auto border-[#d77718] bg-[#10233f] text-white" : "border-slate-300 bg-slate-50"}`}><p>{message.body}</p><p className={`mt-2 text-[11px] ${message.authorType === "CUSTOMER" ? "text-slate-400" : "text-slate-400"}`}>{message.authorType === "CUSTOMER" ? "You" : "Nauterio"} · {new Date(message.createdAt).toLocaleString()}</p></div>)}</div><form onSubmit={(event) => void reply(event)} className="flex gap-2 border-t border-slate-200 p-4"><input name="body" required maxLength={5000} disabled={sending || active.status === "CLOSED"} placeholder="Write a message" className="flex-1 rounded-md border border-slate-300 p-3 text-sm"/><button disabled={sending || active.status === "CLOSED"} className="rounded-md bg-[#d77718] px-5 text-sm font-semibold text-white disabled:opacity-50">Send</button></form></> : <div className="flex min-h-[32rem] items-center justify-center p-8 text-center text-sm leading-6 text-slate-500">Choose a conversation to read the replies,<br/>or start a new one.</div>}</section></div></main>;
}
