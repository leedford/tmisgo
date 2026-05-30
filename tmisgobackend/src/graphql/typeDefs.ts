import { mergeTypeDefs } from "@graphql-tools/merge"


const rootTypes = /* GraphQL */ `
  scalar Date
`;

export const typeDefs = mergeTypeDefs([

  rootTypes
])
