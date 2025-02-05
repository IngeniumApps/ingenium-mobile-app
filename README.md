# Einrichtung und Start eines Expo React Native Projekts (unter Windows)

Diese Anleitung beschreibt Schritt für Schritt, wie ein Expo React Native Projekt auf einem Windows-Computer eingerichtet und gestartet werden kann.

---

## Voraussetzungen

Stelle sicher, dass die folgenden Programme und Tools auf dem System installiert sind:

1. **Node.js**  
   Lade Node.js (LTS Version) von der [offiziellen Website](https://nodejs.org/) herunter und installiere es.  
   Überprüfen Sie die Installation mit:

   ```bash
   node -v
   npm -v
   ```

2. **Git**  
   Installiere Git von der [offiziellen Website](https://git-scm.com/).  
   Überprüfen Sie die Installation mit:

   ```bash
   git --version
   ```

3. **Android Studio (für den Android-Simulator) (Optional)**

   - Lade Android Studio von der [offiziellen Website](https://developer.android.com/studio) herunter und installiere es.
   - Wähle während der Installation die Optionen **Android Virtual Device (AVD)** und **SDK Tools** aus.
   - Konfiguriere ein Android Virtual Device (AVD) in Android Studio unter.

4. **Expo CLI**  
   Installier Expo CLI global mit npm:

   ```bash
   npm install -g expo-cli
   ```

5. **Editor (VS Code oder IntelliJ IDEA Ultimate)**

   - Nützliche Erweiterungen für VS Code: [Youtube - Simon Grimm](https://www.youtube.com/watch?v=qliP8DjXm-c)

6. **Expo Go App (für die Verwendung eines echten Geräts) (Optional)**  
   Installiere die **Expo Go** App aus dem [Google Play Store](https://play.google.com/) oder dem [Apple App Store](https://www.apple.com/app-store/) auf einem mobilen Gerät.

**Wichtig:** Siehe Doc, 😊 falls ich was vergessen habe [React Native Doc](https://reactnative.dev/docs/set-up-your-environment?os=windows&platform=android)

---

## Schritte zur Einrichtung und zum Start (Update --> Development Build wird nun benötigt)

### 1. Repository klonen

Klone das Projekt von GitHub:

```bash
  git clone https://github.com/IngeniumApps/ingenium-mobile-app.git
```

Wechsel in das Projektverzeichnis:

```bash
  cd ingenium-mobile-app
```

### 2. Abhängigkeiten installieren

Installiere die erforderlichen npm-Pakete:

```bash
  npm install
```

### (Update) 2.1 Development Build erstellen mit Expo Prebuild

Erstelle ein Development Build mit Expo Prebuild:

```bash
  npx expo prebuild
```

### (Update) 2.2 Development Build starten

Starte den Development Build auf einem Android-Simulator-Gerät: (Development Build am Device wurde mit Android nicht getestet)

```bash
  npx expo run:android
```

(Funktioniert auf IOS (Simulator & Device) NUR MIT EINEM MAC!!!)

### 3. Projekt starten

Starten Sie den Expo-Entwicklungsserver:

```bash
  npx expo start
```

### 4. Auf einem Android-Simulator ausführen

- Stelle sicher, dass Android Studio läuft und ein Emulator aktiv ist.
- Wähle im Expo-Entwicklungsserver `a` für **Run on Android device/emulator**.  
  Alternativ geht es auch mit dem folgenden Befehl:
  ```bash
  npx expo start --android
  ```

### 5. Auf einem echten Gerät ausführen

- Verbinde das Gerät über USB oder stelle sicher, dass es mit demselben Netzwerk wie der Computer verbunden ist.
- Öffne die **Expo Go** App auf dem Gerät und scanne den QR-Code, der am Expo Entwicklungsserver angezeigt wird.

---

## Häufige Probleme und Lösungen

1. **Fehler: Metro Bundler startet nicht**

   - Stell sicher, dass **Node.js** und **Expo CLI** korrekt installiert sind.
   - Starte den Entwicklungsserver neu:
     ```bash
     npx expo start -c
     ```

2. **Android-Simulator wird nicht erkannt**

   - Vergewissere dich, dass Android Studio läuft und ein Emulator aktiv ist.
   - Starte den Emulator über den AVD-Manager von Android Studio neu.

3. **Expo Go App kann keine Verbindung herstellen**
   - Stelle sicher, dass sich das Gerät im selben WLAN-Netzwerk wie der Computer befindet.
   - Deaktiviere Firewalls oder VPNs, die Verbindungen blockieren könnten.

---

In the output, you'll find options to open the app in a

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

### Links:

**Optionen um die App zu öffnen:**

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), eine limitierte App, die es ermöglicht, die App auf einem echten Gerät zu testen. Sobald nativer Code hinzugefügt wird, ist die Nutzung von Expo Go nicht mehr möglich und es muss ein Development Build erstellt werden.

**Development Build:** (wird später benötigt)

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- Alle Varianten zusammengefasst: [Video - Simon Grimm](https://www.youtube.com/watch?v=cs-zgHjt5RQ&list=PLkZXhGRY-7usZ9zXA9Neg-8nx83faSMr2)

### Weitere nützliche Doks:

- [Expo Doc](https://docs.expo.dev/)
- [React Native Doc](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio?hl=de) Nützlich für den Android Emulator


ESLINT & PRETTIER
eslint --fix .