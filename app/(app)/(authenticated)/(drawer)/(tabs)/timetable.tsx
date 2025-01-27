import {View, Text, Button} from "react-native";
import {getProtectedData} from "@/services/protectedService";

const Page = () => {

    // Teste den Zugriff auf geschützte Daten
    const handlePress = async () => {
        try {
            const data = await getProtectedData();
            console.log("Geschützte Daten erhalten:", data);
            // z. B. im UI anzeigen
        } catch (error) {
            console.error("Fehler:", error);
            // ggf. Login-Navigation einleiten
        }
    };

  return (
    <View>
      <Text>Timetable</Text>
        <Button title="Load protected data" onPress={handlePress} />
    </View>
  );
};

export default Page;

/**
 *    1.	Klicke auf „Load protected data“.
 *    2.	Wird das Token als abgelaufen erkannt, ruft getProtectedData() den Refresh auf.
 *    3.	Klappt der Refresh, bekommst du "This is PROTECTED data!".
 *    4.	Fehlschlägt der Refresh, landet das Ganze im catch-Block und du leitest ggf. den Nutzer zum Login-Screen.
 *
 * So hast du eine einfach gehaltene Lösung, um den 401-Fall in deinem Dummy-Projekt zu testen, ohne komplizierten Interceptor oder mehrfache Retries.
 */