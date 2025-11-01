import { View, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
export default function Profile() {
  const [dataUser, setDataUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheda, setScheda] = useState(true);
  // Prendi email da location.state
  const email = location.state?.email || localStorage.getItem("email");
  //console.log(email);

  const url = Constants.expoConfig?.extra?.URL_USER + encodeURIComponent(email);

  useEffect(() => {
    const token = localStorage.getItem("token");

    //console.log("token nella pagina user", token);
    // Se non c’è token, vai alla login
    if (!token) {
      console.log("token inesistente");
      return;
    }

    // Se manca email, anche torno indietro (per sicurezza)
    if (!email) {
      console.log("email inesistente");
      return;
    }

    // Funzione per fare la richiesta dati
    function requestData() {
      console.log(url);
      fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nel recupero dati");
          return res.json();
        })
        .then((data) => {
          setIsLoading(false);
          //console.log("Dati utente:", data);
          setDataUser(data);
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
          // Se errore (token scaduto o altro) fai logout
          localStorage.removeItem("token");
        });
    }

    requestData();
  }, [email, url]);

  return (
    <View>
      <Text>{dataUser.nome}</Text>
    </View>
  );
}
