module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "profile.line-scdn.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "daisyui.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // We're in the browser build, replace 'crypto' module with 'crypto-browserify'
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
      };
    }

    return config;
  },
};
