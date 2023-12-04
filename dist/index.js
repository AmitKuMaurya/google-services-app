"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const querystring_1 = __importDefault(require("querystring"));
const constants_1 = require("./utils/constants");
const getGoogleAuthURL_1 = require("./utils/getGoogleAuthURL");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const PORT = 4444;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Getting login url from google.
app.get('/auth/google/url', (req, res, next) => {
    res.status(200).redirect((0, getGoogleAuthURL_1.getGoogleAuthURL)());
});
// getting the user from google with g=code.
function fetchTokens({ code, clientId, clientSecret, redirectUri, }) {
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
    return axios_1.default
        .post(url, querystring_1.default.stringify(values), {
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
app.get(`/${constants_1.Redirect_URI}`, async (req, res) => {
    const code = req.query.code;
    const { id_token, access_token } = await fetchTokens({
        code,
        clientId: constants_1.GOOGLE_CLIENT_ID,
        clientSecret: constants_1.GOOGLE_CLIENT_SECRET,
        redirectUri: `${constants_1.SERVER_ROOT_URI}/${constants_1.Redirect_URI}`,
    });
    console.log('id_token: ', id_token);
    console.log('access_token: ', access_token);
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios_1.default
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
            Authorization: `Bearer ${id_token}`,
        },
    })
        .then((res) => res.data)
        .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
    });
    const token = jsonwebtoken_1.default.sign(googleUser, "JWT_SECRET");
    const cookie = res.cookie("COOKIE_NAME", token, {
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
app.get('/hey', (req, res, next) => {
    res.status(200).send("Hey from me!!");
});
app.listen(PORT, () => console.table(`Listening on ${PORT}`));
