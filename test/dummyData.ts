export const generateDummyToken = (expiresInSeconds: number): string => {
  // Einfaches Base64-Token
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresInSeconds }),
  );
  const signature = "abc123"; // Dummy-Signatur
  return `${header}.${payload}.${signature}`;
};

/**
 * Beispiel-User
 */
export const dummyUserData = {
  userId: "123456",
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: "Student",
};

/**
 * Dummy Access + Refresh Tokens + userData
 * Access Token: 1 Minute
 * Refresh Token: 30 Tage (2.592.000 Sek)
 */
export const dummyJWT = {
  token: generateDummyToken(1), // Access Token gültig für 1 Sekunden (zum Testen). In der Praxis: 15 Minuten
  refreshToken: generateDummyToken(60), // Refresh Token gültig für 60 Sekunden (zum Testen). In der Praxis: 30 Tage
  //refreshToken: generateDummyToken(30 * 24 * 60 * 60), // Refresh Token gültig für 30 Tage
  expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  userData: dummyUserData,
};
