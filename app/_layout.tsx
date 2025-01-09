import { Stack } from "expo-router";
import "../global.css";

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as Font from "expo-font";

const fetchFonts = () => {
  return Font.loadAsync({
    "rubik-regular": require("@/assets/fonts/Rubik-Regular.ttf"),
    "rubik-bold": require("@/assets/fonts/Rubik-Bold.ttf"),
    "rubik-light": require("@/assets/fonts/Rubik-Light.ttf"),
    "rubik-medium": require("@/assets/fonts/Rubik-Medium.ttf"),
    "rubik-extrabold": require("@/assets/fonts/Rubik-ExtraBold.ttf"),
    "rubik-semibold": require("@/assets/fonts/Rubik-SemiBold.ttf"),
  });
};

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    fetchFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View className=" flex items-center justify-center h-full">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
