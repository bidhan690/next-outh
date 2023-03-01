import { MongoClient } from "mongodb";

export default async function ConnectDb() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}
