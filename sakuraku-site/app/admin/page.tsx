"use client";

import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/components/firebase";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setErr(null);

      if (!u) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      setChecking(true);
      try {
        const adminRef = doc(db, "admins", u.uid);
        const snap = await getDoc(adminRef);
        const ok = snap.exists();
        setIsAdmin(ok);

        if (!ok) {
          // 管理者じゃないログインは即ログアウト
          await signOut(auth);
          setErr("管理者権限がありません。");
        }
      } catch (e: any) {
        setIsAdmin(false);
        setErr(e?.message ?? "確認に失敗しました");
      } finally {
        setChecking(false);
      }
    });

    return () => unsub();
  }, []);

  const login = async () => {
    setErr(null);
    if (!email.trim() || !pw) return setErr("メールとパスワードを入力してください");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      setPw("");
    } catch (e: any) {
      setErr(e?.message ?? "ログインに失敗しました");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">管理者ページ</h1>
        <p className="mt-2 text-sm text-slate-600">
          管理者は Firebase Auth でログインし、admins コレクションに UID がある場合のみ入れます。
        </p>

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

        {checking ? (
          <p className="mt-6 text-sm text-slate-600">確認中...</p>
        ) : !user ? (
          <div className="mt-6 space-y-3">
            <input
              className="w-full rounded-xl border p-3"
              placeholder="管理者メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-xl border p-3"
              placeholder="パスワード"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <button
              onClick={login}
              className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white"
            >
              ログイン
            </button>
          </div>
        ) : isAdmin ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              管理者としてログイン中：<b>{user.email}</b>
            </div>

            {/* ここに「予約一覧」などを今後追加していけます */}
            <p className="text-sm text-slate-700">
              次のステップ：予約一覧の表示・ステータス変更をここに作ります。
            </p>

            <button
              onClick={logout}
              className="w-full rounded-xl bg-slate-200 py-3 font-semibold"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-600">権限がありません。</p>
        )}
      </div>
    </main>
  );
}
