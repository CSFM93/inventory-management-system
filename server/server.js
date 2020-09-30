const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')
const express = require('express')
const history = require('connect-history-api-fallback')
const { typeDefs } = require('./graphql/typeDefs.js')
const { resolvers } = require('./graphql/resolvers.js')

const connectionOptions = { 
    useCreateIndex:true ,
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify:false 
}

const serverOptions = {
    port: 4000,
    endpoint:'/graphql',
    playground:'/playground'
}

mongoose.connect("mongodb://localhost:27017/mongodb",connectionOptions).catch( err=> console.log(err) )

const server = new GraphQLServer({ typeDefs, resolvers })

mongoose.connection.once("open", function () {
    server.start(serverOptions ,() => console.log(`Server is running on localhost:${serverOptions.port}`))
})


// Comment out the lines bellow if you just want to use the `/playground` otherwise it won't be available
const staticFileMiddleware = express.static('../client/dist');

server.express.use(staticFileMiddleware);

server.express.use(history({
  index: '../client/dist/index.html'
}))


