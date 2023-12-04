import express,{Request,Response,NextFunction, Application} from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import querystring from "querystring";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, Redirect_URI, SERVER_ROOT_URI } from "./utils/constants";
import { getGoogleAuthURL } from "./utils/getGoogleAuthURL";
import jwt from "jsonwebtoken";
import axios from "axios";
const PORT = 4444;
const app : Application = express();
app.use(cors());
app.use(cookieParser());

// Getting login url from google.

app.get('/auth/google/url', (req : Request,res:Response,next : NextFunction)=>{
    res.status(200).redirect(getGoogleAuthURL());
});
// getting the user from google with g=code.

function fetchTokens({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }): Promise<{
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }> {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };
  
    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  }
  
  // Getting the user from Google with the code
  app.get(`/${Redirect_URI}`, async (req, res) => {
    const code = req.query.code as string;
  
    const { id_token, access_token } = await fetchTokens({
        code,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: `${SERVER_ROOT_URI}/${Redirect_URI}`,
    });
    
    console.log('id_token: ', id_token);
    console.log('access_token: ', access_token);
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    const token = jwt.sign(googleUser, "JWT_SECRET");
  
    const cookie : any = res.cookie("COOKIE_NAME", token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });
  
    return res.redirect(cookie);
  });
  
  // Getting the current user
//   app.get("/auth/me", (req, res) => {
//     console.log("get me");
//     try {
//       const decoded = jwt.verify(req.cookies["COOKIE_NAME"], "JWT_SECRET");
//       console.log("decoded", decoded);
//       return res.send(decoded);
//     } catch (err) {
//       console.log(err);
//       res.send(null);
//     }
//   });

// getting logged user.


app.get('/hey',(req : Request,res:Response,next : NextFunction)=>{
    res.status(200).send("Hey from me!!");
})

app.listen(PORT,()=> console.table(`Listening on ${PORT}`));