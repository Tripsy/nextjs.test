
import Link from 'next/link'
import Routes from '@/lib/routes';

export default function Page() {
    return (
        <>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <Link
                            href={Routes.get('dashboard')}
                            className="link-default"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>Projects</li>
                </ul>
            </div>
        </>
    );
}