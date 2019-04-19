const server = require('./graphql-server');
const express = require('express')
const path = require('path')

// {
//   ...
//   "scripts": {
//     "start": "nodemon --exec babel-node src/index.js",
//     "test": "mocha --require @babel/register 'src/**/*.spec.js'"
//   },
//   ...
// }
// create-react-app with express server?
// pass env?
/*
DIRECTORIES (ON HEROKU)
# cp /src/api /dist/api
# cp /src/ml /dist/api/ml
# yarn build /src/web/src /dist/api/web
API VARIABLES
// can I always use port 80?
# set travis API_PORT env variable to 4000
# set heroku API_PORT env variable to 80
# set dev API_PORT env variable to 80

CREATE-REACT-APP starts its own server
express starts its own server

/* serve react files
/graphql serve data
// DEV
.env.development defines REACT_APP_API_PORT
package.json defines proxy to same address as REACT_APP_API_PORT
src/web/src/graphql-client uses REACT_APP_API_PORT
src/api/api.js uses REACT_APP_API_PORT
create-react-app serves html files via localhost:3000
express serves graphql via localhost:4000
// CI
jest loads js files and tests them without starting a server
// HEROKU
REACT_APP_API_PORT setting TBD
express server /* serves static files
express server /graphql serves data
*/

const api = express();

server.applyMiddleware({ app:api, path: '/graphql' });


api.use(express.static(path.join(__dirname, 'web')))
  .get('/', (req, res) => res.render('web/index'))

api.listen({ port: process.env.REACT_APP_API_PORT || 4000 }, () => {
  console.log(`Apollo Server on http://localhost:${process.env.REACT_APP_API_PORT || 4000}/graphql`);
});
