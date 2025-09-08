import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    trailingSlash: false,
    output: 'standalone', // Recommended for Amplify
    // experimental: {
    //     nodeMiddleware: true,
    // },
};

export default nextConfig;

