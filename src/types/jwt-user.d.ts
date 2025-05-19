// types/jwt-user.ts
export interface JwtUser {
  userId?: string;
  sub?: string;
  roles: string[];
}
