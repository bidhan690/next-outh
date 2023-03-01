import { getSession } from "next-auth/react";
import ConnectDb from "@/util/db";
import hashPassword, { verifyPassword } from "@/util/auth";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await ConnectDb();
  const result = client.db("next-auth").collection("users");
  const user = await result.findOne({ email: userEmail });
  if (!user) {
    res.status(404).json({ messages: "User not found" });
    client.close();
    return;
  }
  const currentPassword = user.password;

  const match = await verifyPassword(oldPassword, currentPassword);

  if (!match) {
    res.status(403).json({ message: "Old password is wrong" });
    client.close();
    return;
  }
  const newHashedPassword = await hashPassword(newPassword);
  const updatedPassword = await result.updateOne(
    { email: userEmail },
    { $set: { password: newHashedPassword } }
  );
  res.status(200).json({ message: "Password Updated!" });
  client.close();
}
