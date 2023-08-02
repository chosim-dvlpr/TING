// ws 프로토콜을 사용해야하니 설정해줌
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'ws',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      ws: true,
    })
  );
};