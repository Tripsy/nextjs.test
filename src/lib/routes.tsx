import ValueError from '@/lib/exceptions/value.error';

type RoutesData = {
    [key: string]: {
        href: string;
        group: string | null;
    };
}

// TODO : make group optional redo add() to accept a third argument as RouteData; rename RoutesData to RoutesCollection

class RoutesCollection {
    data: RoutesData = {};

    add(key: string, href: string, group?: string): void {
        this.data[key] = {
            href: href,
            group: group ?? null
        };
    }

    get(path: string, args?: Record<string, string | number | string[]>): string {
        const [rawPath, rawQuery] = path.split('?');

        const route = this.replaceArgs(rawPath, args);

        return rawQuery ? `${route}?${rawQuery}` : route;
    }

    private replaceArgs(key: string, args?: Record<string, string | number | string[]>): string {
        if (!this.data.hasOwnProperty(key)) {
            throw new ValueError('Route not defined for: `' + key + '`');
        }

        let href = this.data[key].href;

        if (args) {
            Object.entries(args).forEach(([k, v]) => {
                if (Array.isArray(v)) {
                    href = href.replace(`:${k}*`, v.map(encodeURIComponent).join('/'));
                } else {
                    href = href.replace(`:${k}`, encodeURIComponent(String(v)));
                }
            });
        }

        return href;
    }
}

let Routes = new RoutesCollection();

Routes.add('home', '/');
Routes.add('terms-and-conditions', '/terms-and-conditions');

// API
Routes.add('proxy', '/api/proxy/:path*');
Routes.add('auth', '/api/auth');

// Account
Routes.add('login', '/account/login');
Routes.add('register', '/account/register');
Routes.add('password-recover', '/account/password-recover');

// Dashboard
// TODO : use chain like Routes.group('dashboard').add().add()
Routes.add('dashboard', '/dashboard', 'dashboard');
Routes.add('user-list', '/dashboard/users', 'dashboard');
Routes.add('user-view', '/dashboard/users/:key', 'dashboard');

export default Routes;