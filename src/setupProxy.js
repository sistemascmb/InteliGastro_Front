const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('[setupProxy] Loaded');

module.exports = function (app) {
  console.log('[setupProxy] Registering /api proxy');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.1.55:8090/api',
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