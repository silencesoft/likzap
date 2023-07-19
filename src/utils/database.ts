const dbLocal = require("db-local");
const { Schema } = new dbLocal({ path: "./data" });

export const Zaps = Schema("Zaps", {
  _id: { type: String, required: true },
  author: { type: String, default: "" },
  event: { type: String, default: "" },
  zaps: { type: Number, default: 0 },
});
