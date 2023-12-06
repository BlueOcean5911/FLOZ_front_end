import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              access_type: "offline",
              prompt: 'consent',
              scope: "profile email https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send",
            }
          },
          httpOptions:{
            timeout:60000,
          }
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
          session.user["id"] = token.id;
          session["accessToken"] = token.accessToken;
          session["refreshToken"] = token.refreshToken;

          if (token.expires && typeof token.expires === 'number' && Date.now() > (token.expires * 1000)) {
            try {
              const refreshedTokens = await refreshAccessToken(token.refreshToken);
              // Update session with new tokens
              session["accessToken"] = refreshedTokens.access_token;
    
              // Update the token in the token callback
              token.accessToken = refreshedTokens.access_token;
            } catch (error) {
              // Handle token refresh error
              console.error('Error refreshing access token:', error);
            }
          }

          return session;
        },
        async jwt({ token, user, account, profile }) {
          if (user) {
            token.id = user.id;
          }
          if (account) {
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
            token.expires = account.expires_at;
          }
          return token;
        },
      }
});

async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  return response.json();
}


export { handler as GET, handler as POST};