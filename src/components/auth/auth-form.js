import { useState, useRef, useEffect } from "react";
import classes from "./auth-form.module.css";
import { signIn, useSession } from "next-auth/react";

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something Went Wrong!");
  }
  return data;
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginStatus, setLoginStatus] = useState(false);
  const [isRegistered, setIsRegisterd] = useState(true);
  const enteredEmail = useRef();
  const enteredPassword = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(e) {
    e.preventDefault();
    const email = enteredEmail.current.value;
    const password = enteredPassword.current.value;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (result.error === "No user found!") {
        setIsRegisterd(false);
        setLoginStatus(false);
      } else if (result.error === "Invalid credentials!") {
        setLoginStatus(true);
        setIsRegisterd(true);
      }
    } else {
      try {
        const result = await createUser(email, password);
      } catch (err) {
        console.log(err);
      }
    }
  }
  function facebookLoginHandler(e) {
    e.preventDefault();
    signIn("facebook");
  }

  function googleLoginHandler(e) {
    e.preventDefault();
    signIn("google");
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={enteredEmail} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={enteredPassword} />
        </div>
        {isRegistered === false && (
          <h2 style={{ color: "red" }}>User not registered!</h2>
        )}
        {loginStatus && <h2 style={{ color: "red" }}>Invalid Password!</h2>}
        <div className={classes.actions}>
          <button type="submit">{isLogin ? "Login" : "Create Account"}</button>
          <button onClick={facebookLoginHandler}>Login with facebook</button>
          <button onClick={googleLoginHandler}>Login with google</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}
