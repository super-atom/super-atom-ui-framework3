import { merge } from "webpack-merge";
import common from "./webpack.common.mjs";
import dev from "./webpack.dev.mjs";
import prod from "./webpack.prod.mjs";

export default (env) => {
  if (env.mode === "development") {
    return merge(common, dev);
  }

  if (env.mode === "production") {
    return merge(common, prod);
  }
};
