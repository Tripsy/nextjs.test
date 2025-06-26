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

    get(key: string, props?: string[]): string {
        return this.#resolveHref(key, props);
    }

    #resolveHref(key: string, props?: string[]): string {
        if (!this.data.hasOwnProperty(key)) {
            throw new ValueError('Route not defined for: `' + key + '`')
        }

        let href = this.data[key].href;

        if (props) {
            Object.entries(props).forEach(entry => {
                const [key, value] = entry;

                href = href.replace(':' + key, value);
            });
        }

        return href;
    }
}

let Routes = new RoutesCollection();

Routes.add('home', '/');
Routes.add('terms-and-conditions', '/terms-and-conditions');

// API
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