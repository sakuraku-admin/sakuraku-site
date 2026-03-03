"use client";

import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/components/firebase";

export default function Page() {
  const timeSlots = useMemo(() => ["10:00", "13:00", "15:00"], []);
  const menus = useMemo(
    () => [
      { key: "60", label: "全身整体 60分" },
      { key: "90", label: "全身整体 90分" },
      { key: "foot", label: "足つぼリフレ 45分" },
    ],
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [time, setTime] = useState(timeSlots[0] ?? "");
  const [menu, setMenu] = useState(menus[0]?.key ?? "");
  const [note, setNote] = useState("");

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    setDone(null);

    if (!name.trim()) return setErr("お名前を入力してください");
    if (!email.trim()) return setErr("メールアドレスを入力してください");
    if (!date) return setErr("日付を選んでください");
    if (!time) return setErr("時間を選んでください");
    if (!menu) return setErr("メニューを選んでください");

    setSending(true);
    try {
      const ref = await addDoc(collection(db, "reservations"), {
        name: name.trim(),
        email: email.trim(),
        date,
        time,
        menu,
        note: note.trim(),
        createdAt: serverTimestamp(),
        status: "new",
      });
      setDone(`予約を受け付けました（ID: ${ref.id}）`);
      setName("");
      setEmail("");
      setDate("");
      setTime(timeSlots[0] ?? "");
      setMenu(menus[0]?.key ?? "");
      setNote("");
    } catch (e: any) {
      setErr(e?.message ?? "送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-rose-50 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white/70 backdrop-blur p-6 shadow">
        <h1 className="text-2xl font-semibold text-emerald-800">さく楽 予約</h1>
        <p className="mt-2 text-sm text-emerald-700/80">
          ご希望の日時を選んで送信してください。
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-emerald-800">お名前</label>
            <input
              className="mt-1 w-full rounded-xl border border-emerald-200 bg-white p-3 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例）山田 花子"
            />
          </div>

          <div>
            <label className="text-sm text-emerald-800">メールアドレス</label>
            <input
              className="mt-1 w-full rounded-xl border border-emerald-200 bg-white p-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-emerald-800">日付</label>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-white p-3 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-emerald-800">時間</label>
              <select
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-white p-3 outline-none"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-emerald-800">メニュー</label>
            <select
              className="mt-1 w-full rounded-xl border border-emerald-200 bg-white p-3 outline-none"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            >
              {menus.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-emerald-800">備考（任意）</label>
            <textarea
              className="mt-1 w-full rounded-xl border border-emerald-200 bg-white p-3 outline-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="体調など"
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {done && <p className="text-sm text-emerald-700">{done}</p>}

          <button
            onClick={submit}
            disabled={sending}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            {sending ? "送信中..." : "予約する"}
          </button>

          <p className="mt-4 text-xs text-emerald-700/70">
            管理者ページは /admin です（一般には表示しません）
          </p>
        </div>
      </div>
    </main>
  );
}
