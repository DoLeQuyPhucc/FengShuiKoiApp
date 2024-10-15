import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/layouts/types/navigationTypes";
import Colors from "@/constants/Colors";
import api from "@/api/axiosInstance";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "ResultScreen">;

type Props = {
  route: ResultScreenRouteProp;
};

const ResultScreen: React.FC<Props> = ({ route }) => {
  const { date } = route.params;
  const [element, setElement] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchElement = async () => {
      try {
        const response = await api.get(`/consultation/${date}`);
        setData(response.data);
        setElement(response.data.element);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching element:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElement();
  }, [date]);

  return (
    <View style={styles.overlay}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlueText} />
      ) : (
        <>
          <Text style={styles.title}>Your Element</Text>
          <View style={styles.elementContainer}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              {element === "Fire" && (
                <Icon name="local-fire-department" size={40} color={"red"} />
              )}
              {element === "Water" && (
                <Icon name="water-drop" size={40} color={"blue"} />
              )}
              {element === "Wood" && (
                <MaterialCommunityIcon
                  name="pine-tree"
                  size={40}
                  color={"green"}
                />
              )}
              {element === "Earth" && (
                <Icon name="landscape" size={40} color={"brown"} />
              )}
              {element === "Metal" && (
                <MaterialCommunityIcon name="gold" size={40} color={"grey"} />
              )}
              <Text style={styles.element}>{element}</Text>
            </View>
            <View
              style={{
                padding: 10,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <Text style={{ color: "#fff" }}>
                <Text style={{ fontWeight: "900" }}>Phuong huong:</Text>{" "}
                <Text style={{ fontWeight: "thin" }}>
                  {" "}
                  {data ? data.fishPondPlacement : ""}
                </Text>
              </Text>
              <Text style={{ color: "#fff" }}>
                <Text style={{ fontWeight: "900" }}>Y nghia:</Text>{" "}
                <Text style={{ fontWeight: "thin" }}>
                  {" "}
                  {data ? data.meaning : ""}
                </Text>
              </Text>
              <Text style={{ color: "#fff" }}>
                <Text style={{ fontWeight: "900" }}>Han che:</Text>{" "}
                <Text style={{ fontWeight: "thin" }}>
                  {" "}
                  {data ? data.limitations : ""}
                </Text>
              </Text>
              <Text style={{ color: "#fff" }}>
                <Text style={{ fontWeight: "900" }}>Mau phu hop:</Text>{" "}
                {data
                  ? data.suitableColors.map((element: any, index: any) => (
                      <Text
                        style={{ fontWeight: "thin", marginRight: 10 }}
                        key={element}
                      >
                        {element}{" "}
                        {index + 1 !== data.suitableColors.length && "| "}
                      </Text>
                    ))
                  : ""}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    backgroundColor: Colors.lightGreen,
    padding: 20,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.darkBlueText,
    marginBottom: 20,
  },
  elementContainer: {
    backgroundColor: Colors.darkBlueText,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  element: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.darkBlueText,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ResultScreen;
