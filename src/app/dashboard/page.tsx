import Link from 'next/link'
import Routes from '@/lib/routes';

export default function Page() {
    return (
        <>
            Dashboard
            <br/>
            <br/>
            <Link
                href={Routes.get('user-list')}
                className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
                Projects
            </Link>
        </>
    );
}