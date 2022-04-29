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
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-community/async-storage";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "tany123@dispostable.com",
      password: "Vodaf@123",
      pin: "",
      loading: false,
      show: false,
      visible: true,
      hasPins: false,
      token: "",
    };
  }

  _changeIcon = () => {
    const { show, visible } = this.state;
    this.setState({
      show: !show,
      visible: !visible,
    });
  };

  handleBackButton = () => {
    Alert.alert(
      "Exit App",
      "Exiting the application?",
      [
        {
          text: "Cancel",
          onPress: null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      }
    );
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  CallPiAdd = () => {
    console.log("this.state.token>>>", this.state.token);

    fetch("https://cityfinance-app.herokuapp.com/api/validate-users-pin", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.token,
      }),
      body: JSON.stringify({
        pin: this.state.pin,
      }),
    })
      .then((response) => response.json())
      .then(async (responseText) => {
        console.log(" responseText.Pillllll>>>", responseText);
        this.setState({
          hasPins: false,
          pin: "",
        });
        if (responseText.success === true) {
          this.props.navigation.navigate("HomeScreen");
          AsyncStorage.setItem("login", "true").catch((err) => {
            console.log("error is: " + err);
          });
          alert(responseText.message.toString());
        } else {
          alert(responseText.error.toString(), responseText.message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        console.log("Error:", error);
      });
  };

  LoginApICalling = () => {
    if (this.state.email === "") {
      alert("Please Provide Email!");
    } else if (this.state.password === "") {
      alert("Please Provide Password!");
    } else {
      if (this.state.hasPins === true) {
        this.CallPiAdd();
      } else {
        this.setState({ loading: true });
        fetch("https://cityfinance-app.herokuapp.com/api/login", {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json", // <-- Specifying the Content-Type
          }),
          body: JSON.stringify({
            email: this.state.email.replace(/ /g, ""),
            password: this.state.password,
            pin: "",
          }),
        })
          .then((response) => response.json())
          .then(async (responseText) => {
            this.setState({ loading: false });
            this.state = {
              token: responseText.data.token.toString(),
            };
            console.log(" responseText.GHetting>>>", responseText);
            if (responseText.success == true) {
              console.log(" responseText.success>>>", responseText.data.token);

              if (responseText.data.hasPin === true) {
                await AsyncStorage.setItem("token", responseText.data.token);

                this.setState({
                  hasPins: true,
                  token: responseText.data.token.toString(),
                });
              } else {
                await AsyncStorage.setItem("token", responseText.data.token);
                this.state = {
                  email: "",
                  password: "",
                };
                this.props.navigation.navigate("Configure");
              }

              // AsyncStorage.setItem("login", "true").catch((err) => {
              //   console.log("error is: " + err);
              // });
              // this.props.navigation.push("HomeScreen");
            } else {
              alert(responseText.error.toString(), responseText.message);
            }
          })
          .catch((error) => {
            this.setState({ loading: false });

            console.log("Error:", error);
            // alert("Error:", error.toString());
          });
      }
    }
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#10AFA6" }}>
        {this.state.loading === true ? (
          <View
            style={{
              position: "absolute",
              top: "40%",
              zIndex: 100,
              alignSelf: "center",
              height: 150,
              width: 150,
              borderRadius: 15,
              backgroundColor: "white",
              elevation: 5,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#24b1E3" />
          </View>
        ) : null}
        <View
          style={{
            position: "absolute",
            width: Dimensions.get("window").width,
            flex: 1,
          }}
        >
          <View style={{ backgroundColor: "#fff", height: 250, flex: 1 }}>
            <Svg
              height="80%"
              width="100%"
              viewBox="0 0 1440 320"
              style={{ position: "absolute", top: 110, height: 600 }}
            >
              <Path
                fill="#10AFA6"
                d={
                  "M0,160L120,133.3C240,107,480,53,720,53.3C960,53,1200,107,1320,133.3L1440,160L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
                }
              />
            </Svg>
          </View>
        </View>
        <View
          style={
            {
              // marginTop: 10,
              // marginHorizontal: 10,
            }
          }
        >
          <Image
            style={{
              width: 200,
              height: 100,
              alignSelf: "center",
              marginTop: 50,
              marginBottom: 0,
              resizeMode: "contain",
            }}
            source={require("../assets/logo.png")}
          />
        </View>
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 20,
            marginVertical: 50,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              marginTop: 25,
              marginBottom: 20,
            }}
          >
            Login
          </Text>
          <View style={{ padding: 10 }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Email Address:
            </Text>

            <TextInput
              placeholder="Your Email"
              onChangeText={(text) => this.setState({ email: text })}
              style={{
                height: 55,
                width: "100%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 50,
                paddingStart: 20,
              }}
            ></TextInput>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Password:
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextInput
                placeholder="Your Password"
                secureTextEntry={this.state.visible}
                onChangeText={(text) => this.setState({ password: text })}
                style={{
                  height: 55,
                  width: "100%",
                  backgroundColor: "white",
                  marginTop: 10,
                  borderRadius: 50,
                  paddingStart: 20,
                }}
              ></TextInput>
              <TouchableOpacity
                onPress={() => this._changeIcon()}
                style={{
                  position: "absolute",
                  right: 20,
                  alignSelf: "center",
                  paddingTop: 10,
                }}
              >
                <Image source={require("../assets/eye.png")} />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.hasPins === true ? (
            <View style={{ padding: 10 }}>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Pin
              </Text>

              <TextInput
                placeholder="Pin"
                value={this.state.pin}
                onChangeText={(text) => this.setState({ pin: text })}
                style={{
                  height: 55,
                  width: "100%",
                  backgroundColor: "white",
                  marginTop: 10,
                  borderRadius: 50,
                  paddingStart: 20,
                }}
              ></TextInput>
            </View>
          ) : null}
          {/* <View style={{ padding: 10 }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              PIN Number:
            </Text>

            <TextInput
              placeholder="Your PIN"
              style={{
                height: 55,
                width: "100%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 50,
                paddingStart: 20,
              }}
            ></TextInput>
          </View> */}

          <TouchableOpacity
            onPress={() => this.LoginApICalling()}
            style={{
              height: 55,
              width: "100%",
              backgroundColor: "#FFCB05",
              borderRadius: 50,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontWeight: "bold",
                color: "black",
                fontSize: 18,
              }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
