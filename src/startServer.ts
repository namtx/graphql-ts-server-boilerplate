import { GraphQLServer } from "graphql-yoga"
import * as session from "express-session"
import * as cookieParser from "cookie-parser"
import * as connectRedis from "connect-redis"
import { createTypeOrmConnection } from "./utils/createTypeOrmConnection"
import { redis } from "./redis"
import { confirmEmail } from "./routes/confirmEmail"
import { generateSchema } from "./utils/generateSchema"

const SESSION_SECRET = "graphql-ts-server-boilerplate"

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: generateSchema(), context: ({ request }) => (
      { redis, url: `${request.protocol}://${request.get("host")}`, session: request.session }
    )
  })

  const RedisStore = connectRedis(session)

  server.express.use(cookieParser())
  server.express.use(session({
    store: new RedisStore({ client: redis as any }),
    name: "graphql-ts-server-boilerplate",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }))
  server.express.get("/confirm/:id", confirmEmail)

  await createTypeOrmConnection()
  const app = await server.start({ port: process.env.NODE_ENV === "test" ? 0 : 4000 })
  console.log("Server is running on localhost:4000")

  return app
}
