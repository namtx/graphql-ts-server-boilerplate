import fetch from "node-fetch";

describe("confirmEmail", () => {
  test("should send invalid back when id is not exists", async () => {
    const rsp = await fetch(`${process.env.TESTING_HOST}/confirm/jjjj`)
    const rspText = await rsp.text()
    expect(rspText).toEqual("INVALID")
  })
})
