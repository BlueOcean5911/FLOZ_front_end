import axios from "axios";
import { setCookie } from "cookies-next";

export default async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    });

    const newAccessToken = response.data.access_token;
    setCookie("p_token", response.data.access_token);
    setCookie("r_token", response.data.refresh_token);
    
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
}