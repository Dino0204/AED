import Link from "next/link";
import { getSessionToken } from "@/lib/session";

export default async function HomePage() {
  const token = await getSessionToken();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-12">
      <h1 className="text-4xl font-bold">AED</h1>
      <p className="text-sm text-neutral-500">Always Ever-growing Document</p>

      {token ? (
        <Link
          href="/mypage"
          className="rounded-md bg-black px-6 py-3 text-white hover:bg-neutral-800 dark:bg-white dark:text-black"
        >
          마이페이지로 이동
        </Link>
      ) : (
        <Link
          href="/auth/login"
          className="rounded-md bg-black px-6 py-3 text-white hover:bg-neutral-800 dark:bg-white dark:text-black"
        >
          GitHub로 로그인
        </Link>
      )}
    </main>
  );
}
