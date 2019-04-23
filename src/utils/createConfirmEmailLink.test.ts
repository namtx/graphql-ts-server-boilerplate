import fetch from "node-fetch"
import { createTypeOrmConnection } from "./createTypeOrmConnection";
import { User } from "../entity/User";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { redis } from "../redis"

let userId: string = ""

beforeAll(async () => {
  await createTypeOrmConnection()
  const user = await User.create({
    email: "tran.xuan.nam+test@sun-asterisk.com",
    password: "2e121e12313asda"
  }).save()
  userId = user.id
})

describe("createConfirmEmailLink", () => {
  test("should confirms user and clear key in redis", async () => {
    const url = await createConfirmEmailLink(process.env.TESTING_HOST, userId, redis)
    const rsp = await fetch(url)
    const rspText = await rsp.text()
    expect(rspText).toEqual("OK")

    const chunks = url.split("/")
    const key = chunks[chunks.length - 1]
    const value = await redis.get(key)
    expect(value).toBeNull()
    const user = await User.findOne({ where: { id: userId } })
    expect(user.confirmed).toBeTruthy()
  })
});
