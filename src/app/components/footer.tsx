import Link from 'next/link';
import { getCurrentSession } from "@/lib/server/auth/session";


export default async function Footer() {
  const { user } = await getCurrentSession();
  const isLoggedIn = !!user;

  const commitHash = process.env.COMMIT_HASH || "unknown";
  const commitDate = process.env.COMMIT_DATE || "unknown";

  return (
    <footer className="h-auto py-4 text-black font-[900] text-sm flex flex-col md:flex-row justify-between items-center gap-4 mx-4">
      <div className="flex flex-col md:flex-row items-center gap-2 font-medium">
        <span>&copy; {new Date().getFullYear()} Armand Packham-McGuiness</span>
        {commitHash !== "unknown" && (
          <span className="text-gray-500 font-normal">
            <span className="hidden md:inline">{" | "}</span>
            commit{" "}
            <a 
              href={`https://github.com/NanoMars/portfolio/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-bold"
            >
              {commitHash}
            </a>
            {" on "}{commitDate}
          </span>
        )}
      </div>
      <ul className="flex flex-row items-center gap-6">
        <li>
          <Link href="/" className="hover:underline font-medium">[home]</Link>
        </li>
        <li>
          <Link href="/projects" className="hover:underline font-medium">[projects]</Link>
        </li>
        {isLoggedIn !== null && (
          <li>
            <Link href={isLoggedIn ? "/admin" : "/login"} className="hover:underline font-medium">[admin]</Link>
          </li>
        )}
      </ul>
    </footer>
  );
}
