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

export class PinAuth extends Component {
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#10AFA6" }}>
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
              marginTop: 40,
              marginBottom: 20,
            }}
          >
            PIN Authentication
          </Text>

          <View style={{ padding: 10 }}>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                alignSelf: "center",
                textAlign: "center",
                width: 320,
                letterSpacing: 1,
              }}
            >
              Please type in the One-time-pin send via text message to your
              mobile number ending +61 *** ** ** 91
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              marginTop: 40,
              marginBottom: 20,
            }}
          >
            ONE-TIME-PIN
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInput
              placeholder="1"
              style={{
                height: 55,
                width: "15%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 5,
                paddingStart: 20,
                fontSize: 17,
              }}
            ></TextInput>
            <TextInput
              placeholder="2"
              style={{
                height: 55,
                width: "15%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 5,
                paddingStart: 20,
                fontSize: 17,
              }}
            ></TextInput>
            <TextInput
              placeholder="3"
              style={{
                height: 55,
                width: "15%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 5,
                paddingStart: 20,
                fontSize: 17,
              }}
            ></TextInput>
            <TextInput
              placeholder="4"
              style={{
                height: 55,
                width: "15%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 5,
                paddingStart: 20,
                fontSize: 17,
              }}
            ></TextInput>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              style={{
                height: 55,
                width: "45%",
                borderWidth: 0.5,
                borderRadius: 50,
                marginTop: 10,
                justifyContent: "center",
                borderColor: "white",
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 16,
                }}
              >
                RESEND OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("SuccessfullPin")}
              style={{
                height: 55,
                width: "45%",
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
                  fontSize: 16,
                }}
              >
                LOGIN
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
      </ScrollView>
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

export default PinAuth;
