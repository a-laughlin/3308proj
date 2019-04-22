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

app.use(express.static(`${__dirname}/../web`))
  .get('/', (req, res) => res.render('/index'));

const apiArgs = {
  //    PORT is Heroku,     4000 is dev
  port: process.env.PORT || 4000
}
app.listen(apiArgs, ()=>{
  console.log(`Express listening on ${ apiArgs.port}`)
  console.log(`graphql listening on ${ apiArgs.port}/graphql`)
});
