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


const app = express();

server.applyMiddleware({ app, path: '/graphql' });

// __dirname should end in api .../dist/api or .../src/api
const src_dir = `${__dirname}/..`;
app.use(express.static(`${src_dir}/web/build`))
  .get('/', (req, res) =>res.render('/index'))
  .get('/graphql', (req, res) => res.render('/graphql'))

const apiArgs = {
  //    PORT is Heroku,     4000 is dev
  port: process.env.PORT || 4000
}
app.listen(apiArgs, ()=>{
  console.log(`${process.env.PWD}/web/build/index served on ${apiArgs.port}`)
  console.log(`graphql listening on ${ apiArgs.port}/graphql`)
});
