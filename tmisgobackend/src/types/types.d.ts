export interface AuthUser {
  id: string;
  nin: string;
  currentStep: string;
}

export interface GraphQLContext {
  user: AuthUser | null;
}