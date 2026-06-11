import { GraphQLScalarType, Kind, GraphQLError } from "graphql";
import { isValid, parseISO, formatISO } from "date-fns";

export const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Strict ISO-8601 Date scalar validated via date-fns",
  
  serialize(value: any) {
    const date = value instanceof Date ? value : new Date(value);
    if (!isValid(date)) {
      throw new GraphQLError("Database returned an invalid Date object");
    }
    return formatISO(date, { representation: "complete" });
  },

  parseValue(value: any) {
    if (typeof value !== "string") {
      throw new GraphQLError("Date scalar parsing expects a valid string representation", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const parsedDate = parseISO(value);
    if (!isValid(parsedDate)) {
      throw new GraphQLError("Provided string is not a valid ISO-8601 date standard", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    return parsedDate;
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const parsedDate = parseISO(ast.value);
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    throw new GraphQLError("Invalid literal token type or format provided for Date conversion", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  },
});