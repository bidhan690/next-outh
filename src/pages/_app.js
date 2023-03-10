import "@/styles/globals.css";
import Layout from "../components/layout/layout";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, session, pageProps }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
