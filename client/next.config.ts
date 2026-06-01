import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // ─── 1. PLATFORM-AGNOSTIC OUTPUT ─────────────────────────────────────────────
  // "standalone" bundles only the exact files needed to run the server.
  // Produces a self-contained .next/standalone directory — copy it anywhere:
  // Docker, Railway, Render, AWS EC2, bare Linux VPS, etc.
  output: "standalone",

  // Acknowledge Turbopack explicitly so that Next.js build uses Turbopack (the
  // default in Next.js 16) without throwing errors about webpack config coexistence.
  turbopack: {},

  // ─── 2. REACT COMPILER (optional, requires babel-plugin-react-compiler) ───────
  // Uncomment + run `npm i babel-plugin-react-compiler` to enable auto-memoization.
  // experimental: { reactCompiler: true } as Record<string, unknown>,


  // ─── 3. REMOTE IMAGE DOMAINS ─────────────────────────────────────────────────
  // Whitelist only the specific hostnames your <Image> components actually use.
  // Next.js optimises, resizes, converts to WebP/AVIF, and caches them at edge.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Generate modern formats automatically — huge savings on mobile
    formats: ["image/avif", "image/webp"],
    // Aggressive cache: revalidate images every 7 days (604800 seconds)
    minimumCacheTTL: 604800,
    dangerouslyAllowSVG: false,
  },

  // ─── 4. HTTP SECURITY HEADERS ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  // ─── 5. WEBPACK BUNDLE OPTIMISATION ──────────────────────────────────────────
  webpack(config, { isServer, dev }) {
    if (!dev && !isServer) {
      // Deterministic chunk IDs → better long-term caching (content-hash stable)
      config.optimization.moduleIds = "deterministic";

      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20_000,
        maxSize: 200_000,
        cacheGroups: {
          // React + Next internals — changes only on framework upgrades
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI library atoms — radix, shadcn, lucide, utility fns
          uiLibs: {
            name: "ui-libs",
            test: /[\\/]node_modules[\\/](radix-ui|@radix-ui|lucide-react|class-variance-authority|clsx|tailwind-merge)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          // Remaining node_modules
          vendors: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
          },
          // Shared application modules (used by 2+ pages)
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // ─── 6. COMPILER OPTIONS ─────────────────────────────────────────────────────
  compiler: {
    // Strip console.log in production, keep console.error/warn for monitoring
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ─── 7. GENERAL PERFORMANCE KNOBS ────────────────────────────────────────────
  // compress: gzip responses from the Node.js server (disable if your reverse
  // proxy — nginx, Caddy, Cloudflare — already handles compression upstream)
  compress: true,

  // Note: `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` were
  // removed from NextConfig in Next.js 15. Both now default to `false`, which
  // is the safe production setting — build fails on type errors or lint errors.

  logging: {
    fetches: {
      // Log full fetch() URLs during build — useful to debug ISR/SSG cache misses
      fullUrl: process.env.NODE_ENV !== "production",
    },
  },
};

export default withBundleAnalyzer(nextConfig);
