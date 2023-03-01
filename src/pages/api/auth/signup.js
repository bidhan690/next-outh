import ConnectDb from "../../../util/db";
import hashPassword from "../../../util/auth";
export default async function Handler(req, res) {
  const data = req.body;
  const { email, password } = data;
  if (req.method === "POST") {
    if (
      !email ||
      !email.includes("@") ||
      email.trim() === "" ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message: "Invalid input! Password should be 7 characters long.",
      });
      return;
    }
    const hashedPass = await hashPassword(password);

    const client = await ConnectDb();

    const db = client.db("next-auth");
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: "User already exist" });
      client.close();
      return;
    }

    const result = await db.collection("users").insertOne({
      email: email,
      password: hashedPass,
    });
    res.status(201).json({ message: "Created User" });
    client.close();
  }
}
