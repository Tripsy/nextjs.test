import { Icons } from '@/app/_components/icon.component';

export function Footer() {
	return (
		<footer className="footer sm:footer-horizontal relative bg-base-100 items-center p-4">
			<aside className="grid-flow-col items-center">
				<p>
					Copyright &copy; {new Date().getFullYear()} - All right
					reserved
				</p>
			</aside>
			<nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a
					href="https://github.com/Tripsy/nextjs.test/tree/main"
					title="Github repository"
					target="_blank"
					rel="noopener"
				>
					<Icons.Design.Github className="text-2xl" />
				</a>
				<a
					href="https://www.linkedin.com/in/david-gabriel-8853a7115/"
					title="LinkedIn profile - Gabriel David"
					target="_blank"
					rel="noopener"
				>
					<Icons.Design.Linkedin className="text-2xl" />
				</a>
			</nav>
		</footer>
	);
}
