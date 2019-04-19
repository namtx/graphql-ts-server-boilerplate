require("ts-node/register");
const { setup } = require("./setup.ts");

module.exports = async function() {
  await setup();
  return null;
};
