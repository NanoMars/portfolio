import Link from "next/link";

const Header = function Header() {
	return (
		<div className="h-[40px] flex items-center justify-between font-[900] mt-2 mx-4">
			<Link href="/">
				<span className="text-2xl font-black">Armand</span>
			</Link>
			<ul className="flex flex-row items-center gap-4">
				<li>
					<Link href="/" className="hover:underline font-black text-xl">[home]</Link>
				</li>
				<li>
					<Link href="/projects" className="hover:underline font-black text-xl">[projects]</Link>
				</li>
			</ul>
		</div>
	);
};

export default Header;