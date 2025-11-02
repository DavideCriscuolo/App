import { View, Text } from "react-native";
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

  const url =
    "https://backend-production-497d.up.railway.app/gym/user/" +
    encodeURIComponent(email);

  useEffect(() => {
    console.log(email);
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
      <View>
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
        <View className="list-none w-full bg-gray-200 p-4 my-2 rounded ">
          <Text className=" py-2   border-b-2 border-black ">
            Peso: {item.peso} kg
          </Text>
          <Text className="py-2  border-b-2 border-black ">
            Spalle: {item.spalle} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Petto: {item.petto} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Vita: {item.vita} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Bicipite Destro: {item.bicipiteDestro} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Bicipite Sinistro: {item.bicipiteSinistro} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Gamba Sinistra: {item.gambaSinistra} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Gamba Destra: {item.gambaDestra} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Polpaccio Sinistro: {item.polpaccioSinistro} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Polpaccio Destro: {item.polpaccioDestro} cm
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Plica: {item.plica} %
          </Text>
          <Text className="py-2   border-b-2 border-black ">
            Data Inserimento: {giorno}-{mese}-{anno}
          </Text>
        </View>
      ) : (
        <Text>Non Ci sono misure</Text>
      )}
    </View>
  );

  return (
    <View className="flex-1  justify-center items-center ">
      <Text>
        {dataUser.nome} {dataUser.cognome}
      </Text>
      <View className=" w-full">
        <FlatList
          data={[dataUser]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
    </View>
  );
}
