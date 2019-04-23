import { generateNamespace } from '@gql2ts/from-schema'
import { generateSchema } from '../utils/generateSchema'
import * as fs from "fs"
import * as path from "path"

const schema = generateSchema()
const myNamespace = generateNamespace('GQL', schema);
fs.writeFile(path.join(__dirname, "../types/schema.d.ts"), myNamespace, (err) => {
  console.log(err)
});
