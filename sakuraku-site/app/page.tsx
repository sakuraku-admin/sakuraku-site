"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/components/firebase";

// NOTE: 筆風フォントは後でGoogle Fontsで追加できます（今は雰囲気のため class 名だけ用意）
const brushFontClass = "font-serif";

type TabKey = "reserve" | "members" | "admin";

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-2xl px-3 py-2 text-sm transition",
        active ? "bg-white shadow text-emerald-800" : "text-emerald-800/70 hover:bg-white/60",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

export default function Page() {
  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Admin (簡易)
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sakura-admin";

  // Reservation form (デモ)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [menu, setMenu] = useState("");

  const [tab, setTab] = useState<TabKey>("reserve");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const timeSlots = useMemo(() => ["10:00", "13:00", "15:00"], []);
  const menus = useMemo(
    () => [
      { key: "60", label: "全身整体 60分" },
      { key: "90", label: "全身整体 90分" },
      { key: "foot", label: "足つぼリフレ 45分" },
    ],
    []
  );

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      alert("登録完了しました 🌸");
    } catch (e: any) {
      alert(e?.message ?? "登録に失敗しました");
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      alert("ログインしました 🌿");
    } catch (e: any) {
      alert(e?.message ?? "ログインに失敗しました");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const adminLogin = () => {
    if (adminPassword === ADMIN_SECRET) {
      setIsAdminLoggedIn(true);
    } else {
      alert("パスワードが違います");
    }
  };

  const submitReservation = () => {
    // ここは次のフェーズでFirestoreに保存します（今はデモ）
    if (!name || !email || !date || !time || !menu) {
      alert("未入力の項目があります");
      return;
    }
    alert("仮予約を受け付けました（次のステップでDB保存にします）🌸");
  };

  return (
    <div className="min-h-screen p-4 sakura-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 sakura-pattern pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-emerald-700">
              <span>🌿</span>
              <p className="text-sm tracking-[0.3em] font-light">プライベート整体サロン</p>
              <span>🌿</span>
            </div>

            <h1 className={`text-5xl ${brushFontClass} bg-gradient-to-r from-rose-400 via-orange-300 to-pink-500 bg-clip-text text-transparent drop-shadow-md tracking-wider`}>
              さく<ruby>楽<rt className="text-xs text-orange-300">ら</rt></ruby>
            </h1>

            <div className="flex items-center justify-center gap-2 text-emerald-600/70">
              <div className="h-px w-16 bg-emerald-400" />
              <span>✿</span>
              <div className="h-px w-16 bg-emerald-400" />
            </div>

            <p className="text-sm text-black leading-relaxed">我孫子駅徒歩1分　完全個室・女性専用　癒しの整体サロン</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-white/60 backdrop-blur p-2 shadow">
          <div className="grid grid-cols-3 gap-2">
            <TabButton active={tab === "reserve"} onClick={() => setTab("reserve")}>予約</TabButton>
            <TabButton active={tab === "members"} onClick={() => setTab("members")}>会員</TabButton>
            <TabButton active={tab === "admin"} onClick={() => setTab("admin")}>管理</TabButton>
          </div>
        </div>

        {/* Reserve */}
        {tab === "reserve" && (
          <div className="rounded-2xl shadow-lg bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
              <Calendar size={18} /> ご予約
            </h2>

            <div className="space-y-2">
              <label className="text-sm">お名前</label>
              <input className="w-full rounded-xl border px-3 py-2" placeholder="山田 花子" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm">メールアドレス</label>
              <input className="w-full rounded-xl border px-3 py-2" type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm">ご希望日</label>
              <input className="w-full rounded-xl border px-3 py-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <p className="text-xs text-gray-500">※キャンセルは前日まで可能です</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm">時間</label>
              <select className="w-full rounded-xl border px-3 py-2" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">時間を選択</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">メニュー</label>
              <select className="w-full rounded-xl border px-3 py-2" value={menu} onChange={(e) => setMenu(e.target.value)}>
                <option value="">メニューを選択</option>
                {menus.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>

            <button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold" onClick={submitReservation} type="button">
              予約する
            </button>

            <button className="w-full rounded-2xl border border-pink-300 py-3" type="button">
              LINE通知を受け取る（次のステップで連携）
            </button>
          </div>
        )}

        {/* Members */}
        {tab === "members" && (
          <div className="rounded-2xl shadow-lg bg-white p-6 space-y-4">
            {!user ? (
              <>
                <h2 className="font-semibold">会員登録 / ログイン</h2>
                <input className="w-full rounded-xl border px-3 py-2" placeholder="メールアドレス" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                <input className="w-full rounded-xl border px-3 py-2" type="password" placeholder="パスワード" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />

                <button className="w-full rounded-2xl bg-pink-400 hover:bg-pink-500 text-white py-3 font-semibold" onClick={register} type="button">
                  新規登録
                </button>
                <button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold" onClick={login} type="button">
                  ログイン
                </button>

                <p className="text-xs text-gray-500">
                  ※一度ログインしたら次回以降は自動でログイン状態になります
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">ログイン中：{user.email}</p>
                <button className="w-full rounded-2xl bg-gray-600 hover:bg-gray-700 text-white py-3 font-semibold" onClick={logout} type="button">
                  ログアウト
                </button>
              </>
            )}
          </div>
        )}

        {/* Admin */}
        {tab === "admin" && (
          <div className="rounded-2xl shadow-lg bg-white p-6 space-y-4">
            {!isAdminLoggedIn ? (
              <>
                <h2 className="font-semibold">管理者ログイン</h2>
                <input className="w-full rounded-xl border px-3 py-2" type="password" placeholder="管理者パスワード" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                <button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold" onClick={adminLogin} type="button">
                  ログイン
                </button>
                <p className="text-xs text-gray-500">※本番では必ずサーバー側の認証（管理者ロール）に置き換えます</p>
              </>
            ) : (
              <>
                <h2 className="font-semibold">管理者画面（デモ）</h2>
                <div className="text-sm space-y-2">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="font-medium">予約管理</p>
                    <p className="text-gray-600">次のステップでFirestoreに予約を保存・一覧表示します。</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="font-medium">顧客管理</p>
                    <p className="text-gray-600">会員（Auth）と顧客情報（DB）を紐付けます。</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="font-medium">サービスメニュー管理</p>
                    <p className="text-gray-600">メニューをDBで編集できるようにします。</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="font-medium">メール配信</p>
                    <p className="text-gray-600">次のステップで一斉配信機能を実装します。</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} さく楽
        </p>
      </motion.div>
    </div>
  );
}
