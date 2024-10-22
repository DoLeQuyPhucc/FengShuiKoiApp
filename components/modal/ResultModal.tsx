import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import Colors from "@/constants/Colors";
import api from "@/api/axiosInstance";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

type ElementType = 'Fire' | 'Water' | 'Wood' | 'Earth' | 'Metal';

const elementImages: Record<ElementType, any> = {
  Fire: require("../../assets/images/fire_koi.png"),
  Water: require("../../assets/images/water_koi.png"),
  Wood: require("../../assets/images/wood_koi.png"),
  Earth: require("../../assets/images/earth_koi.png"),
  Metal: require("../../assets/images/metal_koi.png"),
};

const fishTankImage = require("../../assets/images/fish_tank.png");

const elementBackgroundImages: Record<ElementType, any> = {
  Fire: require("../../assets/images/lightred.png"),
  Water: require("../../assets/images/lightblue.png"),
  Wood: require("../../assets/images/lightgreen.png"),
  Earth: require("../../assets/images/lightbrown.png"),
  Metal: require("../../assets/images/lightmetal.png"),
};

const elementNames: Record<ElementType, string> = {
  Fire: " Mệnh Hỏa",
  Water: "Mệnh Thủy",
  Wood: "Mệnh Mộc",
  Earth: "Mệnh Thổ",
  Metal: "Mệnh Kim",
};

type Props = {
  date: string;
  onClose: () => void;
};

const ResultModal: React.FC<Props> = ({ date, onClose }) => {
  const [element, setElement] = useState<ElementType | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElement = async () => {
      try {
        const response = await api.get(`/consultation/${date}`);
        if (response.data) {
          setData(response.data);
          setElement(response.data.element as ElementType);
        } else {
          setError("No data found for the given date.");
        }
      } catch (error) {
        console.error("Error fetching element:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchElement();
  }, [date]);

  const backgroundImage = element ? elementBackgroundImages[element] : require("../../assets/images/lightgreen.png");

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.overlay}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.darkBlueText} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <Text style={styles.title}>Mệnh của bạn</Text>
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
                  <Text style={styles.element}>{element ? elementNames[element] : ""}</Text>
                </View>
                <View
                  style={{
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "#fff" }}>
                    <Text style={{ fontWeight: "900" }}>Hướng đặt hồ cá:</Text>{" "}
                    <Text style={{ fontWeight: "thin" }}>
                      {" "}{data ? data.fishPondPlacement : ""}
                    </Text>
                  </Text>
                  <Text style={{ color: "#fff" }}>
                    <Text style={{ fontWeight: "900" }}>Ý nghĩa:</Text>{" "}
                    <Text style={{ fontWeight: "thin" }}>
                      {" "}{data ? data.meaning : ""}
                    </Text>
                  </Text>
                  <Text style={{ color: "#fff" }}>
                    <Text style={{ fontWeight: "900" }}>Hạn chế:</Text>{" "}
                    <Text style={{ fontWeight: "thin" }}>
                      {" "}{data ? data.limitations : ""}
                    </Text>
                  </Text>
                  <Text style={{ color: "#fff" }}>
                    <Text style={{ fontWeight: "900" }}>Màu cá thích hợp:</Text>{" "}
                    <View style={styles.colorsContainer}>
                      {data && data.suitableColors && Array.isArray(data.suitableColors)
                        ? data.suitableColors.map((color: string, index: number) => {
                            const validColor = color.startsWith('#') ? color : `#${color}`;
                            return (
                              <View
                                style={[styles.colorCircle, { backgroundColor: validColor }]}
                                key={index}
                              />
                            );
                          })
                        : null}
                    </View>
                  </Text>
                </View>
                {element && (
                  <View style={styles.imageContainer}>
                    <Image source={elementImages[element]} style={styles.koiImage} />
                    <Image source={fishTankImage} style={styles.tankImage} />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onClose}
              >
                <Text style={styles.backButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    alignItems: "center",
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
    alignItems: "center",
  },
  element: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  koiImage: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  tankImage: {
    width: 300,
    height: 300,
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
  colorsContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10, 
    marginRight: 10, 
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ResultModal;