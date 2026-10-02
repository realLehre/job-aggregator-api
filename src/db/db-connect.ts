import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import mongoose from "mongoose";

export const dbConnect = (uri: string) => {
  return mongoose.connect(uri);
};
