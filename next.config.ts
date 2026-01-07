import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    additionalData: `$var: red;`,
  },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**'), new URL('https://images.unsplash.com/**'), new URL("https://sphereone-backend.eglobalsphere.com/**"), new URL("https://eglobalsphere.com/**")],
    dangerouslyAllowSVG: true,
  },
  reactCompiler: false,
};

export default nextConfig;
