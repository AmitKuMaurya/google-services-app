"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthURL = void 0;
const constants_1 = require("./constants");
const querystring_1 = __importDefault(require("querystring"));
const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${constants_1.SERVER_ROOT_URI}/${constants_1.Redirect_URI}`,
        client_id: constants_1.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    return `${rootUrl}?${querystring_1.default.stringify(options)}`;
};
exports.getGoogleAuthURL = getGoogleAuthURL;
