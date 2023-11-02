"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import OauthButton from "@/components/button/OauthButton";
import { useRouter } from "next/navigation";

function Login() {
  const { signInWithGoogle } = useAuthContext();
  const router = useRouter();
  const onGoogleClick = () => {
    signInWithGoogle().then(() => {
      router.push("/home");
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-5">
      <h1 className="text-3xl">FLOZ Cost</h1>
      <div className="max-w-[300px]">
        <OauthButton platform="Google" onClick={onGoogleClick} />
      </div>
    </div>
  );
}

export default Login;
