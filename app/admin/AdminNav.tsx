import Link from "next/link";
import { logoutAdmin } from "@/app/actions/admin-notices";

const linkClass =
  "rounded border px-4 py-2 text-sm font-medium transition";
const idleClass =
  "border-[#a68c6e]/45 bg-white/60 text-[#2a2520] hover:border-gold hover:bg-white";
const activeClass = "border-gold bg-gold/25 text-[#2a2520]";

export function AdminNav({ current }: { current: "notices" | "calendar" }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <nav className="flex flex-wrap gap-2" aria-label="管理メニュー">
        <Link
          href="/admin/notices"
          className={`${linkClass} ${current === "notices" ? activeClass : idleClass}`}
          aria-current={current === "notices" ? "page" : undefined}
        >
          お知らせ
        </Link>
        <Link
          href="/admin/calendar"
          className={`${linkClass} ${current === "calendar" ? activeClass : idleClass}`}
          aria-current={current === "calendar" ? "page" : undefined}
        >
          予約カレンダー
        </Link>
      </nav>
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="rounded border border-[#a68c6e]/55 bg-white/70 px-4 py-2 text-sm font-medium text-[#2a2520] transition hover:border-gold hover:bg-white"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
