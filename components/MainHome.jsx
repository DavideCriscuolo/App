import { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";

import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
export default function MainHome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //  const navigation = useNavigation();
  const navigation = useNavigation();
  async function validate() {
    if (!email || !password) {
      Alert.alert("Inserisci email e password");
      return;
    }

    console.log(email, password);
    const url = Constants.expoConfig?.extra?.URL_LOGIN;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Login fallito", data);
        Alert.alert("Login fallito");
        return;
      }

      if (!data.token) {
        Alert.alert("Login fallito: token non ricevuto");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("email", email);
      console.log("Token salvato");

      navigation.navigate("Profile");
    } catch (error) {
      console.error("Errore fetch:", error);
      Alert.alert("Errore di rete");
    }
  }

  function handleSubmit() {
    validate(); // chiamata senza event
  }
  return (
    <View>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Inserisci la tua email"
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Inserisci password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
}
