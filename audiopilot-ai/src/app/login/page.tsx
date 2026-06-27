import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06131f] px-6 text-white">
      <section className="w-full max-w-md rounded-3xl border border-[#22384d] bg-[#0d1f31] p-8">
        <h1 className="text-3xl font-bold text-[#38bdf8]">AudioPilot AI</h1>
        <p className="mt-2 text-sm text-[#8aa3b8]">Login to your monitoring dashboard.</p>

        <form className="mt-8 space-y-5">
          <input className="w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 outline-none" placeholder="Email address" />
          <input className="w-full rounded-xl border border-[#22384d] bg-[#06131f] px-4 py-3 outline-none" placeholder="Password" type="password" />

          <Link
            href="/dashboard"
            className="block rounded-xl bg-[#38bdf8] px-5 py-3 text-center font-semibold text-[#06131f]"
          >
            Login
          </Link>
        </form>

        <p className="mt-6 text-sm text-[#8aa3b8]">
          New here? <Link href="/register" className="text-[#38bdf8]">Create account</Link>
        </p>
      </section>
    </main>
  );
}