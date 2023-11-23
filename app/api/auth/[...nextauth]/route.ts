import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "https://www.googleapis.com/auth/calendar https://mail.google.com https://www.googleapis.com/auth/gmail.send",
                    redirect_uri: `${process.env.NEXTAUTH_URL}/`
                }
            }
        }),
    ]
});

export { handler as GET, handler as POST};