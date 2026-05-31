/*
 @author: leedford tech team
 @description: This server has the ability to serve both REST and GRAPHQL end points
 @description: This server also supports bidirectional communication using GraphQL subscriptions over websockets
*/

import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@as-integrations/express5';
import context from "./graphql/context";
import { allResolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";


import express  from "express"
import http from "http"
import cors from "cors"
import bodyParser from "body-parser"


import "dotenv/config"



import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";

import { useServer } from 'graphql-ws/use/ws';

import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";


//load enviroment variables
const apiPrefix = "/api"
const app = express()
const httpServer = http.createServer(app)



//schema
const schema = makeExecutableSchema({ typeDefs, resolvers:allResolvers });

/**
 * Instance of GraphQL websocket server
 */
const wsServer = new WebSocketServer<any>({
  server:httpServer,
  path: '/gql',
});

const wsServerCleanup = useServer({
  schema,
  context:async (ctx)=>{
    return context({
      connectionParams:ctx.connectionParams as Record<string, any>
    }) 
  }
},wsServer)

// Set up Apollo Server

// @TODO ApolloServerPluginLandingPageDisabled() apply this plugin to disable gql in prod
const _introspection = process.env.GRAPHQL_INTROSPECTION === "show" ? true : false
const server = new ApolloServer({
  schema,
  introspection:_introspection,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart(){
        return {
             async drainServer(){
                await wsServerCleanup.dispose()
             }
        }
      }
    }
  ],
});



app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}), bodyParser.json());


/**
 * This are the REST end points
 */

// REST endpoints can also support integration with other government systems that may not be able to use GraphQL

app.use(`${apiPrefix}/health`, (req, res) => {
  res.status(200).json({ message: 'tmisgo health check ok' });
});


(
  async()=>{
   await server.start()

   /**
   * This is the main GRAPHQL end point
  */
 
   app.use("/gql/", expressMiddleware(server,{context:context}))
   

  }
 )();




export default httpServer








