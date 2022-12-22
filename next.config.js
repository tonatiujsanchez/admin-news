/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'zenix.dexignzone.com',
      'www.eluniversal.com.mx',
      'contextos-guerrero.vercel.app',
      'images.pexels.com'
    ]
  }
}

module.exports = nextConfig
