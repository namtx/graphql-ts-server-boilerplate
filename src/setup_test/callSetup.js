require("ts-node/register");
const { setup } = require("./setup.ts");

module.exports = async function() {
  if (!process.env.TESTING_HOST) {
    await setup();
  }
  return null;
};
