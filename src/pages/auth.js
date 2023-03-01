import AuthForm from "../components/auth/auth-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1 className="center">Loading....</h1>;
  }

  if (status === "authenticated") {
    router.replace("/profile");
  }

  if (status === "unauthenticated") {
    return <AuthForm />;
  }
}
