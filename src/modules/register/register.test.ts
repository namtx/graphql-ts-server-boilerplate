import { request } from "graphql-request";
import { User } from "../../entity/User";
import { startServer } from "../../startServer";

let getHost = () => ""

beforeAll(async () => {
  const app = await startServer()
  const { port } = app.address()
  getHost = () => `http://127.0.0.1:${port}`
})

const email = "tran.xuan.nam@framgia.com"
const password = "QWEqwe123"

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path,
    message
  }
}
`
it("check with valid email and password", async () => {
  const response = await request(getHost(), mutation(email, password))
  expect(response).toEqual({ register: null })
  const users = await User.find({ where: { email } })
  expect(users.length).toEqual(1)
  const user = users[0]
  expect(user.email).toEqual(email)
  expect(user.password).not.toEqual(password)
})

it("check with duplicated email", async () => {
  const errorResponse: any = await request(getHost(), mutation(email, password))
  expect(errorResponse.register).toHaveLength(1)
  expect(errorResponse.register[0].path).toEqual("email")
})


it("check with invalid email and password", async () => {
  const validationErrorResponse: any = await request(getHost(), mutation("a", "b"))
  expect(validationErrorResponse.register).toHaveLength(3)
  expect(validationErrorResponse.register).toContainEqual({
    path: "email",
    message: "email must be a valid email"
  })
  expect(validationErrorResponse.register).toContainEqual({
    path: "email",
    message: "email must be at least 3 characters"
  })
  expect(validationErrorResponse.register).toContainEqual({
    path: "password",
    message: "password must be at least 3 characters"
  })
})
