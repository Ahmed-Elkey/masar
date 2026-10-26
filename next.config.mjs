/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, turbopack: {root: process.cwd()}, distDir: process.env.NEXT_BUILD_DIR || ".next", async rewrites(){
 const origin=process.env.BROCHURE_ASSET_ORIGIN;
 if(!origin)return [];
 const u=new URL(origin);if(u.protocol!=="https:")throw new Error("Invalid brochure asset origin");
 return [{source:"/brochures/:path*",destination:origin.replace(/\/$/,"")+"/brochures/:path*"}];
 } };
export default nextConfig;
