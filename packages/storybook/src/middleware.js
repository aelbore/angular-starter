import { createProxyMiddleware } from 'http-proxy-middleware'

export default (router) => {
  router.use(
    '/avatar', 
    createProxyMiddleware({
      target: 'https://2019.ng-my.org/assets/imgs/speakers',
      changeOrigin: true
    })
  )
}