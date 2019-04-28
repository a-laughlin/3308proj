const {server} = require('./graphql-server');
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


const app = express();


const static_dir = process.env.DYNO
  ? `${__dirname}/../web/build`
  : `${__dirname}/../web/build`;

server.applyMiddleware({ app, path: '/graphql' });
app.use(express.static(static_dir))
  .get('/', (req, res) => res.render('/index'))


const apiArgs = {
  //    PORT is Heroku,     4000 is dev
  port: process.env.PORT || 4000
}
app.listen(apiArgs, ()=>{
  console.log(`${static_dir} served on /`)
  console.log(`graphql listening on ${ apiArgs.port}/graphql`)
});
