import { eq } from 'drizzle-orm';
import { db } from '../index';
import { sessionTable } from '../schema';
import type { SessionNullable, SessionDraft } from '@/lib/schema_types';

export async function createSession(sessionData: SessionDraft): Promise<SessionNullable | null> {
  const [session] = await db.insert(sessionTable).values(sessionData).returning();
  return session ?? null;
}

export async function updateSessionExpirydate(
  newExpiryDate: Date,
  sessionId: string
): Promise<void> {
  await db
    .update(sessionTable)
    .set({
      expiresAt: newExpiryDate
    })
    .where(eq(sessionTable.id, sessionId));
}

export async function selectSessionFromIdWithUser(sessionId: string) {
  const result = await db.query.sessionTable.findFirst({
    where: eq(sessionTable.id, sessionId),
    with: {
      user: true,
    },
  });
  if (!result) return null;
  return [{ session: result, user: result.user }];
}

export async function deleteSessionFromId(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function deleteSessionsFromUserId(userId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}
