import "./globals.css";

export const metadata = {
  title: "プライベート整体サロン さく楽（さくら）",
  description: "我孫子駅徒歩1分　完全個室・女性専用　癒しの整体サロン",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
