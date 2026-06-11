
import { mergeResolvers } from "@graphql-tools/merge"
import verificationResolvers from "../services/verification/verification.resolvers"

export const allResolvers = mergeResolvers([
  verificationResolvers
])