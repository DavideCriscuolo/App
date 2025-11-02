import { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
export default function MainHome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailManca, setEmailManca] = useState(false);
  const [passManca, setPassManca] = useState(false);
  const [loginFallito, setLoginFallito] = useState(false);
  //  const navigation = useNavigation();
  const navigation = useNavigation();
  const url = "https://backend-production-497d.up.railway.app/gym/login";
  console.log("URL login:", url);
  async function validate() {
    // Reset errori se vuoi gestirli
    setEmailManca(false);
    setPassManca(false);
    setLoginFallito(false);

    if (email === "") {
      setEmailManca(true);
      return;
    }
    if (password === "") {
      setPassManca(true);
      return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginFallito(true);
        console.log("Login fallito");
        return;
      }

      if (!data.token) {
        Alert.alert("Login fallito: token non ricevuto");
        return;
      }

      // Usa AsyncStorage invece di localStorage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("email", email);

      console.log("Login effettuato!");

      // Usa navigation.navigate invece di navigate
      navigation.navigate("ProfileScreen");
    } catch (error) {
      console.error("Errore nella richiesta:", error);
      Alert.alert("Errore di rete", error.message);
    }
  }

  // Chiama validate senza parametri
  function handleSubmit() {
    validate();
  }
  function handleSubmit() {
    validate(); // chiamata senza event
  }
  return (
    <View className="flex-1 justify-center ">
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
