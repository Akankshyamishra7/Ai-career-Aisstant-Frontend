import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06090F] flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
      <h1 className="text-4xl font-extrabold text-indigo-400">404</h1>
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md">
        The requested resource could not be found. Please return to the career intelligence dashboard.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs"
      >
        Return to Home
      </Link>
    </div>
  );
}
