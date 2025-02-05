# 📌 API-Spezifikation für Authentifizierung & Benutzerverwaltung

Diese API bietet folgende Funktionen:  
✔️ **Benutzer-Authentifizierung** (Login, Logout)  
✔️ **Token-Verwaltung** (Access & Refresh Token)  
✔️ **Benutzer-Daten abrufen**  

Die API folgt **RESTful-Standards** und gibt JSON-Antworten zurück.  

---

## 🛠 1️⃣ Authentifizierung

### 🔹 1.1 Login
🔗 **Endpunkt:**  
```
POST /auth/login
```
📥 **Request Body (JSON):**
```json
{
  "username": "testi.mctest",
  "password": "test123"
}
```
📤 **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzgxNDU4NDB9.abc123",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzgxNDU4OTl9.abc123",
  "expiresAt": "2025-02-01T12:00:00Z",
  "user": {
    "userId": "123456",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "Student"
  }
}
```
📌 **Hinweise:**  
- `token`: JWT-Access-Token (gültig z. B. für 15 Minuten)  
- `refreshToken`: Langfristiges Token (z. B. 30 Tage gültig)  
- `expiresAt`: Zeitpunkt, wann der Access-Token abläuft  

---

### 🔹 1.2 Logout
🔗 **Endpunkt:**  
```
POST /auth/logout
```
📥 **Request Header:**  
```
Authorization: Bearer <accessToken>
```
📥 **Request Body (JSON) (optional):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
📤 **Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```
📌 **Hinweise:**  
- Löscht den Refresh-Token auf dem Server (optional)  

---

### 🔹 1.3 Token erneuern (Refresh)
🔗 **Endpunkt:**  
```
POST /auth/refresh
```
📥 **Request Body (JSON):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
📤 **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-02-01T12:30:00Z"
}
```
📌 **Hinweise:**  
- Falls das Refresh-Token ungültig ist oder abgelaufen, gibt der Server `401 Unauthorized` zurück  

---

## 👤 2️⃣ Benutzerverwaltung

### 🔹 2.1 Aktuelle Benutzerinformationen abrufen
🔗 **Endpunkt:**  
```
GET /users/me
```
📥 **Request Header:**  
```
Authorization: Bearer <accessToken>
```
📤 **Response (200 OK):**
```json
{
  "userId": "123456",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "role": "Student"
}
```
📌 **Hinweise:**  
- Falls das Access-Token abgelaufen ist, wird `401 Unauthorized` zurückgegeben  
- Alternativ könnte der Server direkt ein `refreshToken`-Handling integrieren  

---

### 🔹 2.2 Benutzerprofil aktualisieren
🔗 **Endpunkt:**  
```
PUT /users/me
```
📥 **Request Header:**  
```
Authorization: Bearer <accessToken>
```
📥 **Request Body (JSON):**
```json
{
  "firstname": "Johnny",
  "lastname": "Doe",
  "email": "johnny.doe@example.com"
}
```
📤 **Response (200 OK):**
```json
{
  "message": "Profile updated successfully"
}
```
📌 **Hinweise:**  
- Kann verwendet werden, um Benutzerinformationen zu aktualisieren  
- Falls das Access-Token abgelaufen ist, gibt der Server `401 Unauthorized` zurück  

---

### 🔹 2.3 Passwort ändern
🔗 **Endpunkt:**  
```
PUT /users/me/password
```
📥 **Request Header:**  
```
Authorization: Bearer <accessToken>
```
📥 **Request Body (JSON):**
```json
{
  "oldPassword": "test123",
  "newPassword": "newpassword"
}
```
📤 **Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```
📌 **Hinweise:**  
- Falls das alte Passwort nicht stimmt, gibt der Server `400 Bad Request` zurück  

---

## 🚨 Fehler-Handling
Alle Fehler werden als JSON zurückgegeben:

📤 **Beispiel für 401 Unauthorized (Token ungültig oder abgelaufen):**
```json
{
  "error": "Unauthorized",
  "message": "Access token expired"
}
```
📤 **Beispiel für 400 Bad Request (Validierungsfehler):**
```json
{
  "error": "Bad Request",
  "message": "Password must be at least 8 characters long"
}
```
📤 **Beispiel für 500 Internal Server Error (Datenbankfehler etc.):**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## 🔗 Fazit

✅ **Was bleibt in deinem Frontend gleich?**  
- `initializeAuth()` ruft `/users/me` auf, um Benutzerinfos zu laden  
- `refreshAccessToken()` ruft `/auth/refresh` auf, um das Token zu erneuern  
- `logout()` ruft `/auth/logout` auf  

✅ **Was muss angepasst werden?**  
- `authService.login()` muss den echten **POST `/auth/login`** Endpunkt nutzen  
- `authService.refreshToken()` ersetzt das Dummy-Token mit **POST `/auth/refresh`**  
- API-Calls nutzen jetzt `api.get("/users/me")` statt Dummy-Daten  

✅ **Welche neuen Endpunkte sind relevant?**  
- `/users/me/password` für Passwort-Änderungen  
- `/users/me` für Profil-Updates  

Das wären **klare API-Spezifikation**, mit denen das Backend-Team arbeiten kann! 🎯