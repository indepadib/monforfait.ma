import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browsers and legacy crawlers still request /favicon.ico regardless of the
  // PNG icon declared by the app. Reuse the existing published brand asset.
  async redirects(){
    return [{source:'/favicon.ico',destination:'/branding/forfait.png',permanent:false}]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' }
    ]
  },
  async headers(){
    return [{
      source:'/:path*',
      headers:[
        {key:'X-Content-Type-Options',value:'nosniff'},
        {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},

        {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}
      ]
    },{
      // All private and normal website pages resist clickjacking.
      // Public /widget contains only published tariff data and may be embedded.
      source:'/:path((?!widget$).*)',
      headers:[{key:'X-Frame-Options',value:'DENY'}]
    },{
      source:'/widget',
      headers:[{key:'Content-Security-Policy',value:'frame-ancestors https:'}]
    },{
      source:'/suivi',
      headers:[{key:'Referrer-Policy',value:'no-referrer'}, {key:'Cache-Control',value:'no-store'}]
    }]
  }
};
export default nextConfig;
