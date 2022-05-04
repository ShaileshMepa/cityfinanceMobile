import React, { Component } from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Svg, { Path } from "react-native-svg";

export class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  navigateParticularScreen = ({ index }) => {
    if (index === 0) {
      this.props.navigation.navigate("Studentinfo");
    } else if (index === 1) {
      this.props.navigation.navigate("FeesScreen");
    } else if (index === 2) {
      this.props.navigation.navigate("ClassRounting");
    } else if (index === 3) {
      this.props.navigation.navigate("HomeWorkScreen");
    } else if (index === 4) {
      this.props.navigation.navigate("Rewards");
      console.log("index 4");
    } else if (index === 5) {
      this.props.navigation.navigate("Activities");
      console.log("index 4");
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("window").width,
            flex: 1,
          }}
        >
          <View style={{ height: 250 }}>
            <ImageBackground
              style={{ width: "100%", height: 300 }}
              resizeMode="stretch"
              source={require("../assets/background.png")}
            ></ImageBackground>
          </View>
        </View>

        <View
          style={{
            marginTop: 50,
            marginHorizontal: 20,
            marginVertical: 50,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={{ height: 50 }}>
              <ImageBackground
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
                source={require("../assets/menu.png")}
              ></ImageBackground>
            </TouchableOpacity>
            <ImageBackground
              style={{ width: 120, height: 35, bottom: 10 }}
              resizeMode="contain"
              source={require("../assets/logo_png.png")}
            ></ImageBackground>
            <View style={{ marginEnd: 16 }}>
              <Image
                style={{
                  width: 45,
                  height: 45,
                  resizeMode: "contain",
                  borderRadius: 100,
                  bottom: 12,
                  shadowColor: "white",
                  elevation: 0.5,
                }}
                source={require("../assets/placeholder.png")}
              />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text
                style={{ fontSize: 25, color: "white", fontWeight: "bold" }}
              >
                Notification
              </Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                color: "white",
                fontWeight: "600",
                marginTop: "5%",
                marginStart: 10,
              }}
            >
              2 Messages
            </Text>
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                backgroundColor: "white",
                borderRadius: 15,
                elevation: 5,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignSelf: "flex-start",
                  width: "62%",
                  marginStart: 10,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 20,
                    fontWeight: "500",
                    marginTop: 20,
                    marginStart: 13,
                  }}
                >
                  Date
                </Text>

                <Text
                  style={{
                    color: "black",
                    fontSize: 20,
                    fontWeight: "500",
                    marginTop: 20,
                    marginStart: 13,
                  }}
                >
                  Subject
                </Text>
              </View>
              <View style={{ padding: 15, marginTop: 10 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    width: "68%",
                    marginStart: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ImageBackground
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                      source={require("../assets/loan.png")}
                    ></ImageBackground>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "600",
                        marginStart: 8,
                      }}
                    >
                      01/06/2021
                    </Text>
                  </View>

                  <Text
                    style={{ color: "#000", fontSize: 16, marginStart: 30 }}
                  >
                    Application Approved
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    width: "68%",
                    marginStart: 10,
                    marginTop: 20,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ImageBackground
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                      source={require("../assets/loan.png")}
                    ></ImageBackground>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "600",
                        marginStart: 8,
                      }}
                    >
                      01/06/2021
                    </Text>
                  </View>

                  <Text
                    style={{ color: "#000", fontSize: 16, marginStart: 30 }}
                  >
                    Application Approved
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    width: "68%",
                    marginStart: 10,
                    marginTop: 20,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ImageBackground
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                      source={require("../assets/loan.png")}
                    ></ImageBackground>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "600",
                        marginStart: 8,
                      }}
                    >
                      01/06/2021
                    </Text>
                  </View>

                  <Text
                    style={{ color: "#000", fontSize: 16, marginStart: 30 }}
                  >
                    Application Approved
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Notification;
