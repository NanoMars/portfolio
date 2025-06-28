import { GitHub } from 'arctic';
import { env } from '@/lib/server/env';

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  `${env.URL}/api/login/github/callback`
);

