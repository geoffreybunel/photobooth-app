import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-zinc-900 shadow-md">
      <ul className="flex justify-center gap-8 py-4">
        <li>
          <Link href="/" className="text-zinc-800 dark:text-zinc-200 hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/About" className="text-zinc-800 dark:text-zinc-200 hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/Contact" className="text-zinc-800 dark:text-zinc-200 hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}