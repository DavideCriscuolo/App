import { View, StyleSheet } from "react-native";
import MainHome from "../components/MainHome";

export default function Home() {
  return (
    <View style={styles.container}>
      <MainHome></MainHome>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // prende tutto lo spazio disponibile
    justifyContent: "center", // centra verticalmente
    alignItems: "center", // centra orizzontalmente
    padding: 20,
  },
});
