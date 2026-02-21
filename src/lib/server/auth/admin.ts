import { User } from "@/lib/schema_types";

const ADMIN_IDS = process.env.ADMIN_GITHUB_IDS?.split(",").map(id => Number(id)) || [];

export function isAdmin(user: User) {
  console.log("checking " + user.githubId + " against " + ADMIN_IDS);
  return ADMIN_IDS.includes(user.githubId);
}
