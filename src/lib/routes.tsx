import ValueError from '@/lib/exceptions/value.error';

type RoutesData = {
    [key: string]: {
        href: string;
        group: string | null;
    };
}

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
Routes.add('login', '/login');
Routes.add('dashboard', '/dashboard', 'dashboard');
Routes.add('user-list', '/dashboard/users', 'dashboard');
Routes.add('user-view', '/dashboard/users/:key', 'dashboard');

export default Routes;