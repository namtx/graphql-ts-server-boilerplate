import { GraphQLServer } from "graphql-yoga"
import { importSchema } from "graphql-import"
import * as path from "path"
import * as fs from "fs"
import * as Redis from "ioredis"

import { createTypeOrmConnection } from "./utils/createTypeOrmConnection";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { User } from "./entity/User";

export const startServer = async () => {
  const schemas: GraphQLSchema[] = []
  const folders = fs.readdirSync(path.join(__dirname, "./modules"))
  folders.forEach(folder => {
    const { resolvers } = require(`./modules/${folder}/resolvers.ts`)
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    )
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
  })

  const redis = new Redis()

  const server = new GraphQLServer({
    schema: mergeSchemas({ schemas }), context: ({ request }) => (
      { redis, url: `${request.protocol}://${request.get("host")}` }
    )
  })

  server.express.get("/confirm/:id", async (req, res) => {
    const userId = await redis.get(req.params.id)
    await User.update({ id: userId }, { confirmed: true })
    res.send("OK")
  })

  await createTypeOrmConnection()
  const app = await server.start({ port: process.env.NODE_ENV === "test" ? 0 : 4000 })
  console.log("Server is running on localhost:4000")

  return app
}
