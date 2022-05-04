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
import MenuDrawer from "react-native-side-drawer";
import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-picker/picker";

export class ForgetPassword extends Component {
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
      feedbackmessage: "",
      relationship_Selected: "General",
      loanname: "",
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

  SubmitButtonCall = () => {
    if (this.state.relationship_Selected === "General") {
      this.callGeneral();
    } else {
      this.callRequestAStatement();
    }
  };

  callRequestAStatement = () => {
    fetch("https://cityfinance-app.herokuapp.com/api/mail-loans-statement", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
      body: JSON.stringify({
        loan_name: this.state.loanname,
      }),
    })
      .then((response) => response.json())
      .then(async (responseText) => {
        console.log(" responseText. Request>>>", responseText);
        alert(
          "Your feedback has been sent. Please allow us up to 1 business day for a response."
        );
        this.setState({ loanname: "", relationship_Selected: "General" });
        if (responseText.success == true) {
          console.log(" responseText.success>>>", responseText.data);
          // alert(
          //   "Your feedback has been sent. Please allow us up to 1 business day for a response."
          // );
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  callGeneral = () => {
    fetch("https://cityfinance-app.herokuapp.com/api/mail-loans-feedback", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
      body: JSON.stringify({
        feedback: this.state.feedbackmessage,
      }),
    })
      .then((response) => response.json())
      .then(async (responseText) => {
        console.log(" responseText. Request>>>", responseText);

        this.setState({
          feedbackmessage: "",
          relationship_Selected: "General",
        });
        alert(
          "Your feedback has been sent. Please allow us up to 1 business day for a response."
        );
        if (responseText.success == true) {
          console.log(" responseText.success>>>", responseText.data);
          // alert(
          //   "Your feedback has been sent. Please allow us up to 1 business day for a response."
          // );
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  ChangeCity = (selectedCIty) => {
    console.log("Selected State", selectedCIty);
    this.setState({ relationship_Selected: selectedCIty });
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
                  source={require("../assets/placeholder.png")}
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
                Forget Password
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
              onPress={() => this.props.navigation.navigate("LoginScreen")}
              style={{ height: 50 }}
            >
              <ImageBackground
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
                source={require("../assets/whiteback.png")}
              ></ImageBackground>
            </TouchableOpacity>
            <ImageBackground
              style={{ width: 120, height: 35, bottom: 10 }}
              resizeMode="contain"
              source={require("../assets/logo_png.png")}
            ></ImageBackground>
            <View style={{ marginEnd: 16 }}></View>
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
                Forget Password
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
                alignSelf: "center",
                backgroundColor: "white",
                borderRadius: 7,
                elevation: 5,
                marginTop: 15,
              }}
            >
              <View style={{ padding: 10, marginTop: 0 }}>
                <TextInput
                  onChangeText={(text) => this.setState({ loanname: text })}
                  value={this.state.loanname}
                  placeholder="Enter Your Email"
                  style={{
                    height: 40,
                    width: "100%",
                    textAlignVertical: "top",
                    fontSize: 13,
                  }}
                ></TextInput>
              </View>
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("LoginScreen")}
          style={{
            width: "80%",
            height: 50,
            backgroundColor: "#FFCB05",
            borderRadius: 50,
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 15,
            marginTop: 25,
            position: "absolute",
            bottom: 10,
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
            Send
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default ForgetPassword;
