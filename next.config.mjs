/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          tls: false,
          http: false,
          https: false,
          child_process: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
