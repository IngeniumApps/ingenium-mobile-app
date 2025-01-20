export const generateDummyToken = (expiresInSeconds: number): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresInSeconds }),
  );
  const signature = "abc123"; // Dummy-Signatur
  return `${header}.${payload}.${signature}`;
};

export const dummyUserData = {
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: "Student",
};

export const dummyJWT = {
  token: generateDummyToken(60), // Access Token gültig für 60 Sekunden (zum Testen)
  refreshToken: generateDummyToken(900), // Refresh Token gültig für 1 Stunde
  //refreshToken: generateDummyToken(30 * 24 * 60 * 60), // Refresh Token gültig für 30 Tage
  expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
};
