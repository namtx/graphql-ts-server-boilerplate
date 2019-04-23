import request from "graphql-request"
import { User } from "../../entity/User";
import { redis } from "../../redis";

const loginMutation = (email: string, password: string) => `
mutation {
  login(email: "${email}", password: "${password}") {
    path,
    message
  }
}
`

const registerMutation = (email: string, password: string) => `
mutation {
  register(email: "${email}", password: "${password}") {
    path,
    message
  }
}
`

describe("login", () => {
  test("email is not exists", async () => {
    const response = await request(process.env.TESTING_HOST, loginMutation("namtx+test@sun-asterisk.com", "Single123"))

    expect(response).toEqual({
      login: [{
        path: "email",
        message: "invalid email, password"
      }]
    })
  })

  test("email is not confirmed", async () => {
    const registerResponse =
      await request(process.env.TESTING_HOST, registerMutation("namtx+test@sun-asterisk.com", "Single123"))
    const loginResponse =
      await request(process.env.TESTING_HOST, loginMutation("namtx+test@sun-asterisk.com", "Single123"))

    expect(loginResponse).toEqual({
      login: [{
        path: "email",
        message: "please confirm your email"
      }]
    })
  })


  test("password is not match", async () => {
    await request(process.env.TESTING_HOST, registerMutation("namtx+test@sun-asterisk.com", "Single123"))
    await User.update({ confirmed: true }, { email: "namtx+test@sun-asterisk.com" })
    const loginResponse =
      await request(process.env.TESTING_HOST, loginMutation("namtx+test@sun-asterisk.com", "Single111"))
    expect(loginResponse).toEqual({
      login: [{
        path: "email",
        message: "invalid email, password"
      }]
    })
  })
})
