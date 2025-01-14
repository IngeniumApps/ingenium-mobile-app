import {Stack} from "expo-router";

const PublicLayout = () => {
  return (
      <Stack>
          <Stack.Screen name="login"/>
          <Stack.Screen name="legal-modal/[type]" options={{
              presentation: "modal",
          }}/>
      </Stack>
  )
}

export default PublicLayout