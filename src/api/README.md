# API

### package.json

### api.js
starts an express web server  
express serves /graphql in development  
and  
/index.html and /graphql in production  

### graphql-server.js
Runs a graphql server (separately from API.js since the web server is unncessary for testing)  
typeDefs define possible API response types, including Query+Mutation types that form the public api  
resolvers get the data to fulfill `Query` and `Mutation` types in typeDefs  

### datasource-apis
Get data from various sources, so graphql-server resolvers are unaware of outside apis
Examples: (filesystem, sqlite, ml)  
same-named functions in different datasource-apis files should return the same data (so sqlite.readFoo() === filesystem.readFoo());  

#### sqlite.js
when the file loads, it automatically creates the sqlite database and applies
migrations in the datasource-apis/migrations directory

Unfortunately, the npm `sqlite` package's lightweight migrations, force a numerical migration file naming convention, so iso date stamps don't work.  Thus, backups at a certain date, will be difficult to match up with the migrations that need to happen afterward.
