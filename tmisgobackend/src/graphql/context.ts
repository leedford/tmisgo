import { Request, Response } from "express";

export const context = async ({req,res}:{req:Request,res:Response}) => {
  const bearer = req.header("Authorization");
  let user = null;

  if (bearer) {
    const token = bearer.split(" ")[1];
    // user = await getUserFromToken(token);
  }

  return { user };
}