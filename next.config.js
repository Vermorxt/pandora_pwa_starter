/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
})
const { i18n } = require('./next-i18next.config')

const dev = process.env.ENV !== 'production'

console.log('----> process env: ', process.env)

module.exports = withPWA({
  pwa: {
    dest: 'public',
    skipWaiting: true,
  },
  i18n,
})
