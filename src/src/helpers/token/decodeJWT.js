import jwt from "jwt-simple";

export default function decodeJWT(token = "") {
  try {
    return jwt.decode(token, process.env.REACT_APP_API_SECRET);
  } catch {
    return false;
  }
}
