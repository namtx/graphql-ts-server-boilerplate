import * as yup from "yup"
import * as bcryptjs from "bcryptjs"
import { ResolverMap } from "../../types/graphql_utils"
import { User } from "../../entity/User"
import { formatYupError } from "../../utils/formatYupError";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { sendConfirmEmail } from "../../utils/sendConfirmEmail";

const schema = yup.object().shape({
  email: yup.string().email().min(3).max(255),
  password: yup.string().min(3).max(255)
})

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments, { redis, url }) => {
      try {
        await schema.validate(args, { abortEarly: false })
      } catch (err) {
        return formatYupError(err)
      }

      const { email, password } = args;
      const userAlreadyExists = await User.findOne({ where: { email }, select: ["id"] })

      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: "already taken"
          }
        ]
      }
      const hashedPassword = await bcryptjs.hash(password, 10)


      const user = await User.create({
        email,
        password: hashedPassword
      });
      await user.save()

      const confirmLink = await createConfirmEmailLink(url, user.id, redis)
      await sendConfirmEmail(user.email, confirmLink)
      return null
    }
  },
  Query: {
    bye: () => "Hello there!"
  }
}
