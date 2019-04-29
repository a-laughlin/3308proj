const {server} = require('./graphql-server');
const express = require('express')
const app = express();

server.applyMiddleware({ app, path: '/graphql' });
app.use('/',express.static(`${__dirname}/../web/build`)) // serves all files in dir


const apiArgs = {
  //    PORT is Heroku,     4000 is dev
  port: process.env.PORT || 4000
}
app.listen(apiArgs, ()=>{
  console.log(`graphql listening on ${apiArgs.port}/graphql`)
});
