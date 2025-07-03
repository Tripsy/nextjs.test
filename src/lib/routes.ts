import ValueError from '@/lib/exceptions/value.error';

export enum RouteAuthRequirement {
    PROTECTED = 'protected', // Admin OR Operator
    AUTHENTICATED = 'authenticated',
    UNAUTHENTICATED = 'unauthenticated',
    PUBLIC = 'public',
}

type RouteProps = {
    type?: string;
    authRequirement?: RouteAuthRequirement
};

type RoutesData = {
    [key: string]: {path: string} & RouteProps;
};

export type RouteMatch = {
    name: string;
    props: RouteProps
} | null;

class RouteBuilder {
    constructor(
        private readonly parent: RoutesCollection,
        private readonly type: string,
        private _authRequirement?: RouteAuthRequirement
    ) {}

    public authRequirement(requirement: RouteAuthRequirement): this {
        this._authRequirement = requirement;

        return this;
    }

    public add(name: string, path: string, props: Partial<RouteProps> = {}): this {
        this.parent.add(name, path, {
            type: this.type,
            authRequirement: props.authRequirement ?? this._authRequirement ?? RouteAuthRequirement.PUBLIC,
            ...props
        });
        return this;
    }
}

class RoutesCollection {
    private data: RoutesData = {};

    public add(name: string, path: string, props?: RouteProps): this {
        if (!name || !path) {
            throw new ValueError('Route name and path are required');
        }

        this.data[name] = { path, ...props };

        return this;
    }

    // Start a scoped group
    public group(name: string): RouteBuilder {
        return new RouteBuilder(this, name);
    }

    public get(
        name: string,
        args?: Record<string, string | number | string[]>
    ): string {
        if (!this.data[name]) {
            throw new ValueError(`Route not defined for: ${name}`);
        }

        const [basePath, query] = this.data[name].path.split('?');
        const replacedPath = this.replacePathParams(basePath, args);

        return query ? `${replacedPath}?${query}` : replacedPath;
    }

    private replacePathParams(
        path: string,
        args?: Record<string, string | number | string[]>
    ): string {
        if (!args) {
            return path;
        }

        let result = path;

        for (const [key, value] of Object.entries(args)) {
            if (Array.isArray(value)) {
                result = result.replace(`:${key}*`, value.map(encodeURIComponent).join('/'));
            } else {
                result = result.replace(`:${key}`, encodeURIComponent(String(value)));
            }
        }

        return result;
    }

    public match(pathname: string): RouteMatch {
        for (const [name, props] of Object.entries(this.data)) {

            const pattern = this.convertPathToRegex(props.path);
            const match = pathname.match(pattern);

            if (match) {
                return {
                    name: name,
                    props: props
                };
            }
        }

        return null;
    }

    private convertPathToRegex(path: string): RegExp {
        // Convert :param to named capture group
        // Convert :param* to wildcard match
        const pattern = path
            .replace(/\/:(\w+)(\*)?/g, (_, param, wildcard) =>
                wildcard ? `/(?<${param}>[^/]+(?:/[^/]+)*)` : `/(?<${param}>[^/]+)`)
            .replace(/\*/g, '.*');

        return new RegExp(`^${pattern}(?:\\?.*)?$`); // Include optional query string
    }
}

let Routes = new RoutesCollection();

Routes.add('home', '/');
Routes.add('terms-and-conditions', '/terms-and-conditions');

// API
Routes.group('api')
    .add('proxy', '/api/proxy/:path*')
    .add('auth', '/api/auth');

// Account
Routes.group('account').authRequirement(RouteAuthRequirement.UNAUTHENTICATED)
    .add('login', '/account/login')
    .add('logout', '/account/logout', {authRequirement: RouteAuthRequirement.AUTHENTICATED})
    .add('register', '/account/register')
    .add('password-recover', '/account/password-recover');

// Dashboard
Routes.group('dashboard').authRequirement(RouteAuthRequirement.PROTECTED)
    .add('dashboard', '/dashboard')
    .add('user-list', '/dashboard/users')
    .add('user-view', '/dashboard/users/:key');

export default Routes;