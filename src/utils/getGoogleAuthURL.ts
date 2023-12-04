import { GOOGLE_CLIENT_ID, Redirect_URI, SERVER_ROOT_URI } from "./constants";
import querystring from 'querystring'
export const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${SERVER_ROOT_URI}/${Redirect_URI}`,
      client_id: GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    }
    
    return `${rootUrl}?${querystring.stringify(options)}`;
  
}