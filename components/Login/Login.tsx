"use client";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import { getCookie } from "cookies-next";
import LoginScreen from "./LoginScreen";

function Login() {
  const { signInWithGoogle } = useAuthContext();
  const router = useRouter();
  const authStatus = getCookie("AUTH_STATUS");

  const status = authStatus ? authStatus : "";


  useEffect(() => {
    const status = authStatus;
    if (status === "SIGNED_IN") {
      router.push("/dashboard/home");
    }
  }, [status]);

  const onGoogleClick = () => {
    signInWithGoogle();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-5">
      <LoginScreen onClick={onGoogleClick}/>
      
    </div>
  );
}

export default Login;
