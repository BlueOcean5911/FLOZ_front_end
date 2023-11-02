"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSupabaseContext } from "./SupabaseContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Session } from "@supabase/supabase-js";

interface AuthContextInterface {
  isSignedIn: boolean;
  userSession: Session | null;
  signOut: () => Promise<void>;
  //   signInWithEmail: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  //   signInWithSlack: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { supabaseClient } = useSupabaseContext();

  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check if the user is logged in on page load
    checkSession();
    // Listen for changes to the authentication state
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);
        await handleSessionChange(session);
      }
    );
    return () => {
      // Unsubscribe from the auth listener when the component unmounts
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  async function checkSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return;
    }
    handleSessionChange(data.session);
  }

  async function handleSessionChange(session: Session | null) {
    setUserSession(session);

    // Check if the user is signed in
    if (!session) {
      setIsSignedIn(false);
      // If the user is not signed in, they must be redirected to the signin page
      //   if (router.pathname !== "/signin") {
      //     router.replace("/signin");
      //   }
      return;
    }

    // Add the token to make authenticated HTTP requests
    const accessToken = session?.access_token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Add the user if this is the first time they are signing in
    // await addUserIfNew({
    //   userId: session.user.id,
    // });

    setIsSignedIn(true);

    // If the user is signed in, don't show the sign in page
    // if (router.pathname === "/signin") {
    //   router.push("/");
    // }
  }

  // Adds the user if they don't already exist
  type AddUserIfNewArgs = {
    userId: string;
    name?: string;
  };
  async function addUserIfNew({ userId, name }: AddUserIfNewArgs) {
    // Check if the user exists
    let userExists = true;
    try {
      const { data: supabase_user_exists_response_data } = await axios.get<{
        user_exists: boolean;
      }>(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/supabase/user/exists/${userId}`
      );

      userExists = supabase_user_exists_response_data.user_exists;
    } catch (error) {
      // TODO: Error handler
      console.error(`Error: ${error}`);
      return;
    }

    // Only create a user if this is the first time they are logging in
    if (userExists) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/supabase/user/create`,
        { user_id: userId, name }
      );
    } catch (error) {
      // TODO: error handler
      console.error(`Error: ${error}`);
    }
  }

  async function signOut() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      // TODO: error handler
      console.error(`Error: ${error}`);
    }
  }

  // TODO: Set up custom SMTP to get around send limits
  //   async function signInWithEmail(email: string) {
  //     const { error } = await supabaseClient.auth.signInWithOtp({
  //       email,
  //       options: {
  //         // Route where we employ Proof Key for Code Exchange (PKCE)
  //         // After successful exchange, the user will be redirected to an actual page
  //         emailRedirectTo: window.origin,
  //       },
  //     });

  //     if (error) {
  //       // TODO: Error handler
  //       console.log(`Error: ${error}`);
  //     }
  //   }

  async function signInWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.origin },
    });

    if (error) {
      // TODO: Error handler
      console.log(`Error: ${error}`);
    }
  }

  //   async function signInWithSlack() {
  //     const { error } = await supabaseClient.auth.signInWithOAuth({
  //       provider: "slack",
  //       options: {
  //         redirectTo: window.origin,
  //       },
  //     });

  //     if (error) {
  //       // TODO: Error handler
  //       console.log(`Error: ${error}`);
  //     }
  //   }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        userSession,
        signOut,
        // signInWithEmail,
        signInWithGoogle,
        // signInWithSlack,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext must be within AuthContextProvider");
  }

  return context;
};
