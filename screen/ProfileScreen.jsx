import { View, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native-web";
export default function Profile() {
  const [dataUser, setDataUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheda, setScheda] = useState(true);
  const navigation = useNavigation();

  // Prendi email da location.state
  const email = location.state?.email || localStorage.getItem("email");
  //console.log(email);

  const url = Constants.expoConfig?.extra?.URL_USER + encodeURIComponent(email);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("token inesistente");
        navigation.navigate("Home");
        return;
      }

      if (!email) {
        console.log("email inesistente");
        navigation.navigate("Home");
        return;
      }

      requestData(token);
    };

    const requestData = async (token) => {
      try {
        console.log(url);
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero dati");
        }

        const data = await response.json();
        setIsLoading(false);
        setDataUser(data);
        console.log(data);
      } catch (err) {
        console.error(err);
        await AsyncStorage.removeItem("token");
        navigation.navigate("Home");
      }
    };

    checkAuth();
  }, [email, url, navigation]);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Caricamento...</Text>
      </View>
    );
  }
  const data = new Date(dataUser.data);
  const giorno = data.getDate();
  const mese = data.getMonth() + 1;
  const anno = data.getFullYear();
  const renderItem = ({ item }) => (
    <View>
      {item.spalle &&
      item.petto &&
      item.vita &&
      item.gambaSinistra &&
      item.gambaDestra &&
      item.polpaccioDestro &&
      item.polpaccioSinistro &&
      item.plica &&
      item.bicipiteDestro &&
      item.bicipiteSinistro &&
      item.data ? (
        <View style={styles.listItem}>
          <Text style={styles.textList}>Peso: {item.peso} kg</Text>
          <Text style={styles.textList}>Spalle: {item.spalle} cm</Text>
          <Text style={styles.textList}>Petto: {item.petto} cm</Text>
          <Text style={styles.textList}>Vita: {item.vita} cm</Text>
          <Text style={styles.textList}>
            Bicipite Destro: {item.bicipiteDestro} cm
          </Text>
          <Text style={styles.textList}>
            Bicipite Sinistro: {item.bicipiteSinistro} cm
          </Text>
          <Text style={styles.textList}>
            Gamba Sinistra: {item.gambaSinistra} cm
          </Text>
          <Text style={styles.textList}>
            Gamba Destra: {item.gambaDestra} cm
          </Text>
          <Text style={styles.textList}>
            Polpaccio Sinistro: {item.polpaccioSinistro} cm
          </Text>
          <Text style={styles.textList}>
            Polpaccio Destro: {item.polpaccioDestro} cm
          </Text>
          <Text style={styles.textList}>Plica: {item.plica} %</Text>
          <Text style={styles.textList}>
            Data Inserimento: {giorno}-{mese}-{anno}
          </Text>
        </View>
      ) : (
        <Text>Non Ci sono misure</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>
        {dataUser.nome} {dataUser.cognome}
      </Text>
      <View>
        <FlatList
          data={[dataUser]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        ></FlatList>
      </View>

      {/* <FlatList data={[{ key: dataUser.peso }]}></FlatList> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  list: {
    padding: 10,
  },
  listItem: {
    marginVertical: 6,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  textList: {
    marginBottom: 5,
  },
});
