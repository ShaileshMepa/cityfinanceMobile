import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-community/async-storage";

export class SuccessfullPin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authToken: "",
      loanstatus: "",
    };
  }

  async componentDidMount() {
    const AuthToken = await AsyncStorage.getItem("token");

    this.setState({ authToken: AuthToken });

    fetch(
      "https://cityfinance-app.herokuapp.com/api/get-current-applications",
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json", // <-- Specifying the Content-Type
          Authorization: "Bearer " + AuthToken,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseText) => {
        console.log("Get api/getcurrentloan", responseText.data);

        if (responseText.success === true) {
          this.setState({
            loanstatus: responseText.data[0].application[0].genesis__status__c,
          });
        } else {
        }
      })
      .catch((error) => {
        // alert(error);
      });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#10AFA6" }}>
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
          <Image
            style={{
              width: 80,
              height: 80,
              alignSelf: "center",
              marginTop: 50,
              resizeMode: "contain",
            }}
            source={require("../assets/configurepin.png")}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              marginTop: 40,
              marginBottom: 20,
            }}
          >
            Configure a PIN to use
          </Text>

          <View style={{ padding: 10 }}>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                alignSelf: "center",
                textAlign: "center",
                width: 200,
              }}
            >
              Thank You. Your PIN has been set for future use:
            </Text>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              // flexDirection: "row",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.state.loanstatus === "Awaiting Documents"
                  ? this.props.navigation.navigate("CurrentLoan")
                  : this.state.loanstatus === "Awaiting Signature"
                  ? this.props.navigation.navigate("Documenttosign")
                  : this.props.navigation.navigate("HomeScreen")
              }
              style={{
                height: 55,
                width: "45%",
                backgroundColor: "#FFCB05",
                borderRadius: 50,
                marginTop: 10,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  color: "black",
                  fontSize: 16,
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={() => handleSubmit()}
          // validationSchema={validationSchema}
        >
          <ErrorMessage
            error="Invalid email and/or password."
            visible={loginFailed}
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Login" />
          <Button
            title="Forgot Passsword"
            color="secondary"
            onPress={() => navigation.navigate(routes.FORGOT_PASSWORD)}
          />
        </Form> */}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  loginbtn: {
    marginTop: "8%",
    borderRadius: 50,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#483D8B",
  },
  loginText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default SuccessfullPin;
