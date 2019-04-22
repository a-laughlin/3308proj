//
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // app is an express app, so in theory,
  // we could just apply the apollo server middleware here
  // but keeping it on a different port
  // in case something conflicts with
  // create-react-app's internal version
  app.use(proxy('/graphql', { target: 'http://localhost:4000/graphql' }));
};
