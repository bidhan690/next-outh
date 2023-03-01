import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";
import { signIn, signOut, useSession } from "next-auth/react";

function UserProfile() {
  const { data: session, status } = useSession();
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <p>{session && session.user.email}</p>
      {session && (
        <span style={{ backgroundImage: `url('${session.user.image}')` }} />
      )}
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
