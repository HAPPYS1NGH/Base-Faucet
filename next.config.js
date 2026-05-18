/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    // Disable x-powered-by header
    poweredByHeader: false,
}

module.exports = nextConfig
