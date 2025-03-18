import Link from "next/link";

export function NavBar() {
  return (
    <header className="py-4">
      <nav className="flex items-center justify-between mx-auto container">
        <Link href="/" className="text-2xl font-semibold">
          <span className="text-green-500">Health</span>Connect
        </Link>
        <Link
          href="/login"
          className=" text-base font-medium hover:text-gray-700 transition-colors"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
