import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ConnectDb from "../../../util/db";
import { verifyPassword } from "../../../util/auth";
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    FacebookProvider({
      clientId: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_SECRET_ID,
    }),

    CredentialsProvider({
      async authorize(credentials) {
        const client = await ConnectDb();
        const collection = client.db("next-auth").collection("users");
        const user = await collection.findOne({ email: credentials.email });
        if (!user) {
          client.close();
          throw new Error("No user found!");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials!");
        }
        client.close();
        return { email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      if (account.provider === "facebook") {
        await ConnectDb();
        const db = client.db("next-auth");

        await db.collection("users").insertOne({
          userId: user.id,
          provider: account.provider,
          timestamp: new Date(),
        });

        return true;
      }
    },
  },
});
