import { GraphQLSchema } from "graphql";
import * as fs from "fs"
import * as path from "path"
import { importSchema } from "graphql-import";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";

export const generateSchema = (): GraphQLSchema => {
  const schemas: GraphQLSchema[] = []
  const folders = fs.readdirSync(path.join(__dirname, "./../modules"))
  folders.forEach(folder => {
    const { resolvers } = require(`./../modules/${folder}/resolvers.ts`)
    const typeDefs = importSchema(
      path.join(__dirname, `./../modules/${folder}/schema.graphql`)
    )
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
  })
  return mergeSchemas({ schemas })
}
