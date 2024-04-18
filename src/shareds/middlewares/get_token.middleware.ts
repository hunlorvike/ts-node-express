export const getTokenFromHeader = (
  authorizationHeader: string | undefined,
): string | null => {
  if (!authorizationHeader) return null;
  const token = authorizationHeader.split(' ')[1];
  return token || null;
};
