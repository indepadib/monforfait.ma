import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        {key:'X-Frame-Options',value:'DENY'},
        {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}
      ]
    },{
      source:'/suivi',
      headers:[{key:'Referrer-Policy',value:'no-referrer'}, {key:'Cache-Control',value:'no-store'}]
    }]
  }
};
export default nextConfig;
