import express from 'express';
import http from 'http';
import 'reflect-metadata';

import { createDB } from './db/db-client';
import createApolloServer from './apollo/createApolloServer';

async function main() {
  await createDB();
  const app = express();

  const apolloServer = await createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);

  httpServer.listen(process.env.PORT || 4000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
      server started on => http://localhost:4000
      graphql playground => http://localhost:4000/graphql
      `);
    } else {
      console.log(`
      Production server Started...
      `);
    }
  });
}

main().catch((err) => console.error(err));