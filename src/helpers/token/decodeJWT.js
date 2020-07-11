import jwt from "jwt-simple";

export default function decodeJWT(token = "") {
  try {
    return jwt.decode(token, process.env.REACT_APP_API_SECRET);
  } catch (err) {
    if (err.message === "Token expired") return { expired: true };
    else return false;
  }
}
