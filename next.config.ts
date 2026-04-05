import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Copies only the minimal runtime files needed to run the app.
    // Required for the multi-stage Docker build (runner stage uses server.js).
    output: "standalone",
    typedRoutes: true
};

export default nextConfig;
