import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useAuthContext } from "../contexts/AuthContext";
import OauthButton from "../components/button/OauthButton";

export default function Home() {
  const { signInWithGoogle } = useAuthContext();

  const onGoogleClick = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-5">
      <h1 className="text-3xl">Login Cost</h1>
      <div className="max-w-[300px]">
        <OauthButton platform="Google" onClick={onGoogleClick} />
      </div>
    </div>
  );
}
