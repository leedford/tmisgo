import { mergeTypeDefs } from "@graphql-tools/merge"

import verificationTypes from "../services/verification/verification.types";

const rootTypes = /* GraphQL */ `
  scalar Date
`;

export const typeDefs = mergeTypeDefs([
  rootTypes,
  verificationTypes
])
