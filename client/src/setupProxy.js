// proxy이용해 CORS 설정하는 부분 (server port=4000, client port=3000 서로 포트가 다르므르 설정 필수)

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    })
  );
};