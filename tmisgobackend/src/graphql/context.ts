import { Request } from "express";
import { AuthUser, GraphQLContext } from "../types/types.js";
import { decodeJWT } from "../utils/managejwt.js";



/**
 * Parses and verifies a standard Bearer token string
 */
const getUserFromToken = async (token?: string): Promise<AuthUser | null> => {
  if (!token || !token.startsWith("Bearer ")) {
    // TODO: handle public facing routes
    return null;
  }

  const jwtToken = token.split(" ")[1];
  try {
    const decoded = await decodeJWT(jwtToken);
    if (!decoded) {
      return null;
    } 
    return {
      id: (decoded as any).id,
      nin: (decoded as any).nin,
      currentStep: (decoded as any).currentStep,
    };
  } catch (error) {
    return null; 
  }
};

/**
 * Universal context generator for Express HTTP requests and WebSocket connections
 */
export const context = async ({ req, connectionParams }: { 
  req?: Request; 
  connectionParams?: Record<string, any> 
}): Promise<GraphQLContext> => {


  // Handle Subscription WebSocket authorization handshake
  if (connectionParams) {
    const authHeader = connectionParams.Authorization || connectionParams.authorization;
    const user = await getUserFromToken(authHeader);
    return { user };
  }

  // Handle typical HTTP Query / Mutation request authorization
  if (req) {
    const authHeader = req.headers.authorization;
    const user = await getUserFromToken(authHeader);
    return { user };
  }

  return { user: null };
};