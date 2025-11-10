const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('[setupProxy] Loaded');

module.exports = function (app) {
  console.log('[setupProxy] Registering /api proxy');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://26.41.173.127:8090/api',
      changeOrigin: true,
      secure: false,
      logLevel: 'silent',
      xfwd: false,
      pathRewrite: {
        '^/api': '/',
      },
    })
  );
};