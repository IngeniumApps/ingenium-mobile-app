import {View, Text} from "react-native";

const Page = () => {

  return (
    <View>
      <Text>Timetable</Text>
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