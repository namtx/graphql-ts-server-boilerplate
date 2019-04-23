import * as bcryptjs from "bcryptjs"
import { ResolverMap } from "../../types/graphql_utils";
import { User } from "../../entity/User";


export const resolvers: ResolverMap = {
  Query: {
    bye2: () => "Bye 2!"
  },
  Mutation: {
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments, { session }) => {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return [{
          path: "email",
          message: "invalid email, password"
        }]
      }

      if (!user.confirmed) {
        return [{
          path: "email",
          message: "please confirm your email"
        }]
      }

      const validPassword = await bcryptjs.compare(password, user.password)
      if (!validPassword) {
        return [{
          path: "email",
          message: "invalid email, password"
        }]
      }

      session.userId = user.id

      return null
    }
  }
}
