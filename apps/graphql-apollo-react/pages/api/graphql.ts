import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { BusinessSchema } from '../../graphql/schemas/business';
import { BusinessResolver } from '../../graphql/resolvers/business';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
const cors = Cors();
let server;
export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  if (!server) {
    server = new ApolloServer({
      typeDefs: [BusinessSchema],
      resolvers: [BusinessResolver,
        { JSON: GraphQLJSON },
        {
          JSONObject: GraphQLJSONObject,
        }

      ],
    });
    const startServer = server.start();
    await startServer;
  }
  await server.createHandler({ path: '/api/graphql' })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
