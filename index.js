import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './src/models';
import { refreshTokens } from './src/auth';

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'example.com' },
  development: { ssl: false, port: 4000, hostname: 'localhost' }
};
const SECRET = 'kjsahdkajshdkjasd1233';
const SECRET2 = 'adfffgdsfhfghhkklkfjdssaqdf23123';

const environment = 'development';
const config = configurations[environment];

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, './src/graphql/schema')),
  {
    all: true
  }
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './src/graphql/resolvers'))
);
const corsOptions = {
  origin: 'http://localhost:3000'
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    console.log(req.headers);
    return {
      models,
      SECRET,
      SECRET2,
      user: req.user
    };
  }
});

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      console.log(user, 'USER');
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

const app = express();
// app.use(cors());
app.use(cors(corsOptions));
app.use(addUser);
apollo.applyMiddleware({ app, cors: false });

// Create the HTTPS or HTTP server, per configuration
let server;
if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
    },
    app
  );
} else {
  server = http.createServer(app);
}

// Add subscription support
apollo.installSubscriptionHandlers(server);

models.sequelize.sync({}).then(() => {
  server.listen({ port: config.port }, () => {
    console.log(
      '🚀 Server ready at',
      `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
        apollo.graphqlPath
      }`
    );
  });
});
