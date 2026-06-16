/** @type {import('next').NextConfig} */

const nextConfig = {
  allowedDevOrigins: [
    'http://192.168.1.200:3000',
    'http://localhost:3000'
  ],
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ]
      }
    ]
  }
};

export default nextConfig;
