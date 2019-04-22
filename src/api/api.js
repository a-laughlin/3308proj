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


const api = express();

server.applyMiddleware({ app:api, path: '/graphql' });


api.use(express.static(path.join(__dirname, 'web')))
  .get('/', (req, res) => res.render('web/index'));

const apiArgs = {
  //    PORT is Heroku,     4000 is dev
  port: process.env.PORT || 4000
}
api.listen(apiArgs, ()=>{
  console.log(`Express listening on ${ apiArgs.port}`)
  console.log(`graphql listening on ${ apiArgs.port}/graphql`)
});
