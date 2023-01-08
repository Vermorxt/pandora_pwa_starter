# Progressive Web App Example

This example uses [`next-pwa`](https://github.com/shadowwalker/next-pwa) to create a progressive web app (PWA) powered by [Workbox](https://developers.google.com/web/tools/workbox/).

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/progressive-web-app&project-name=progressive-web-app&repository-name=progressive-web-app)

## How to use

### installation

`yarn` or

`yarn clean:install`

### Development

#### build dev

`yarn dev`

or

`yarn build` 
`yarn start`



#### build ios/android

`yarn static` 
`npx cap sync`

`npx cap open ios` or 
`npx cap open android`

for android you can use following command to test on an external device directly without opening android studio:

`npx cap run ios -l --external`


## Trobleshooting

To have bluetooth available on web, you must use chrome browser and enable experimental web features:

`chrome://flags/#enable-experimental-web-platform-features`









Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
