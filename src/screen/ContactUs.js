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
  BackHandler,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Svg, { Path } from "react-native-svg";
import MenuDrawer from "react-native-side-drawer";
import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-picker/picker";

export class ContactUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      relationshipList: [
        {
          relationship__c: "General",
        },
        {
          relationship__c: "Request a statement",
        },
      ],
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  async componentDidMount() {
    const AuthToken = await AsyncStorage.getItem("token");
    // this.props.navigation.goBack('')
    this.setState({ authToken: AuthToken });
    fetch("https://cityfinance-app.herokuapp.com/api/userprofile", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + AuthToken,
      }),
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log("Get User Data", responseText.data);

        if (responseText.status === "success") {
          this.setState({
            username: responseText.data.name,
          });
        } else {
          // alert(responseText.message);
        }
      })
      .catch((error) => {
        // alert(error);
      });
  }

  ChangeCity = (selectedCIty) => {
    console.log("Selected State", selectedCIty);
    this.setState({ RelationSelect: selectedCIty });
    // this.setState({ selectedCIty: selectedCIty, Town: selectedCIty });
  };

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

  toggleOpen = () => {
    this.setState({ opendrawer: !this.state.opendrawer });
  };

  drawerContent = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 0.93 }}>
          <View style={{ height: 210 }}>
            <ImageBackground
              style={{ width: "100%", height: 210 }}
              resizeMode="stretch"
              source={require("../assets/background.png")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginStart: 20,
                  marginTop: 50,
                }}
              >
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    resizeMode: "contain",
                    borderRadius: 10,
                  }}
                  source={require("../assets/photo.png")}
                />
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("EditProfile")}
                  style={{ marginStart: 15 }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "600", color: "white" }}
                  >
                    {this.state.username}
                  </Text>
                  <Text style={{ fontSize: 18, color: "white" }}>
                    Edit profile
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          <View style={{ marginTop: 35, marginStart: 20 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("HomeScreen")}
              // onPress={() => this.props.navigation.navigate("CurrentLoan")}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
                source={require("../assets/dashboard.png")}
              />
              <Text
                style={{
                  color: "#00AEA5",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginStart: 15,
                }}
              >
                Dashboard
              </Text>
            </TouchableOpacity>

            <View
              style={{
                borderWidth: 0.2,
                borderColor: "lightgrey",
                width: "80%",
                alignSelf: "flex-end",
                marginTop: 15,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
                source={require("../assets/notification.png")}
              />
              <Text
                style={{
                  color: "#000",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginStart: 15,
                }}
              >
                Notification
              </Text>
            </View>
            <View
              style={{
                borderWidth: 0.2,
                borderColor: "lightgrey",
                width: "80%",
                alignSelf: "flex-end",
                marginTop: 15,
              }}
            ></View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ContactUs")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
                source={require("../assets/contactus.png")}
              />
              <Text
                style={{
                  color: "#000",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginStart: 15,
                }}
              >
                Contact Us
              </Text>
            </TouchableOpacity>
            <View
              style={{
                borderWidth: 0.2,
                borderColor: "lightgrey",
                width: "80%",
                alignSelf: "flex-end",
                marginTop: 15,
              }}
            ></View>
            <TouchableOpacity
              onPress={() => this.Logout()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
                source={require("../assets/logout.png")}
              />
              <Text
                style={{
                  color: "#000",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginStart: 15,
                }}
              >
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.toggleOpen()}
          style={{
            height: 45,
            width: "90%",
            alignSelf: "center",
            backgroundColor: "#FFCB05",
            borderRadius: 100,
            marginTop: "20%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 20,
              color: "black",
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MenuDrawer
          open={this.state.opendrawer}
          drawerContent={this.drawerContent()}
          drawerPercentage={65}
          animationTime={400}
          overlay={true}
          opacity={0.4}
        ></MenuDrawer>
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
            <TouchableOpacity
              onPress={() => this.setState({ opendrawer: true })}
              style={{ height: 50 }}
            >
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
                source={require("../assets/photo.png")}
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
                Contact Us
              </Text>
              {/* <TouchableOpacity
                style={{
                  width: 120,
                  height: 45,
                  backgroundColor: "#FFCB05",
                  borderRadius: 50,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    alignSelf: "center",
                    color: "white",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Apply Now
                </Text>
              </TouchableOpacity> */}
            </View>
            {/* <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "600",
                marginTop: "7%",
                alignSelf: "center",
              }}
            >
              Email: test@test.com
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "600",
                marginTop: "7%",
                alignSelf: "center",
              }}
            >
              Mobile: 1234567890
            </Text> */}
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 100,
                marginTop: 15,
              }}
            >
              <Picker
                onValueChange={(itemValue, itemIndex) =>
                  this.ChangeCity(itemValue)
                }
                selectedValue={this.state.RelationSelect}
                dropdownIconColor="#f9f9f9"
              >
                {Object.entries(this.state.relationshipList).map(([key, v]) => (
                  <Picker.Item
                    label={v.relationship__c}
                    value={v.relationship__c}
                  />
                ))}
              </Picker>
            </View>
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
              <View style={{ padding: 15, marginTop: 0 }}>
                <TextInput
                  placeholder="Please Provide feedback on my loan application"
                  style={{
                    height: 200,
                    width: "100%",
                    textAlignVertical: "top",
                    fontSize: 13,
                  }}
                ></TextInput>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: "40%",
                height: 50,
                backgroundColor: "#FFCB05",
                borderRadius: 50,
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 15,
                marginTop: 25,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: "center",
                  color: "white",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                SUBMIT
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default ContactUs;
