// TODO: Delete this file after merging the backend

/**
 * The generateDummyToken function creates a simple Base64-encoded JWT token.
 * It takes an expiration time in seconds as a parameter and constructs the token
 * by encoding a header and payload using the btoa function.
 * The header specifies the algorithm and type of the token,
 * while the payload includes the expiration time.
 * A dummy signature is appended to complete the token:
 *
 * ```tsx
 * const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
 * const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
 * const signature = "abc123";
 * return `${header}.${payload}.${signature}`;
 * ```
 *
 * @param expiresInSeconds
 */
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
 * The dummyUserData object represents a sample user with properties such as
 * userId, firstname, lastname, email, and role.
 * This object is used to simulate user data in tests:
 */
export const dummyUserData = {
  userId: "123456",
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: "Student",
};

/**
 * The dummyJWT object contains a dummy access token, a refresh token, and user data.
 * The access token is generated with a short expiration time (1 second) for testing purposes,
 * while the refresh token is generated with a longer expiration time (60 seconds).
 */
export const dummyJWT = {
  token: generateDummyToken(60), // access token - 60s for testing (15min in real)
  refreshToken: generateDummyToken(900), // refresh token - 15min for testing (30 days in real)
  userData: dummyUserData,
};
