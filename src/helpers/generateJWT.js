import jwt from "jwt-simple";

export default function generateJWT(obj = {}) {
  return jwt.encode(obj, process.env.REACT_APP_API_SECRET, "HS256");
}
