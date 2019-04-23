import { Request, Response } from "express"
import { User } from "../entity/User"
import { redis } from "../redis"

export const confirmEmail = async (req: Request, res: Response) => {
  const userId = await redis.get(req.params.id)
  if (userId) {
    await User.update({ id: userId }, { confirmed: true })
    await redis.del(req.params.id)
    res.send("OK")
  } else {
    res.send("INVALID")
  }
}
