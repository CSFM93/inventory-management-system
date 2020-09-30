This is the backend part needed in order to follow the "Roll your own management application" tutorial published in the LogRocket Blog.

I used Node.js, Docker,MongoDB, graphql-yoga, mongoose and connect-history-api-fallback to create a GraphQL server for the inventory management application that you are building in this tutorial.

First, i set up a database using MongoDB and Docker. After creating the database, i built a GraphQL server using graphql-yoga and then connected the server to the database using mongoose.