/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  async redirects () {
    return [
      {
        source: '/',
        destination: '/uploadImage',
        permanent: true,
      },
    ]
    },
};

export default nextConfig;
