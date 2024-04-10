import jwt from "jsonwebtoken";

const generateTokens = (id: string) => {

//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT secret is not defined");
//   }

  return jwt.sign({ id },"opay", {
    expiresIn: "30d",
  });
};
export { generateTokens };
