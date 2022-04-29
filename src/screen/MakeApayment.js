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
  Linking,
  Modal,
  FlatList,
  BackHandler,
} from "react-native";
import MenuDrawer from "react-native-side-drawer";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

export class MakeApayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opendrawer: false,
      loanuniqueno: "",
      loanamount: "",
      termsinweeks: "",
      relationshipList: [
        {
          relationship__c: "User",
        },

        {
          relationship__c: "Admin",
        },
      ],

      RelationSelect: "",
      appliedon: "",
      requestaloan: false,
      loanbalanceamount: 0,
      username: "",
      firstnamereq: "",
      lastnamereq: "",
      relationshipreq: "",
      uploadDoc: false,
      imageDocument: [],
      DocumentUpload: "",
      isSelectImage: "",
      RegisterData: "",
      imagetype: "",
      imagePath: "",
      authToken: "",
      submitdocument: true,
      applieddocument: false,
      captureareferance: false,
      thankyoufunded: false,
      requestModal: false,
      id: this.props.route.params.id,
      ThakyouMessage: "",
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

  closeAll = () => {
    this.setState({
      submitdocument: false,
      applieddocument: false,
      captureareferance: false,
      thankyoufunded: false,
      uploadDoc: false,
      requestaloan: false,
      opendrawer: false,
    });
  };

  async componentDidMount() {
    console.log("Id getting>", this.state.id);
    if (this.state.id === 0) {
      this.setState({ ThakyouMessage: "Your Documents Uploaded Sucessfully." });
    } else {
      this.setState({
        ThakyouMessage:
          "your Additional payment for the amount $420.00 has been processed.",
      });
    }
    const AuthToken = await AsyncStorage.getItem("token");

    this.setState({ authToken: AuthToken });
    setTimeout(() => {
      this.callInit();
    }, 1000);
  }

  callInit = async () => {
    console.log("Get Current App >>");

    fetch("https://cityfinance-app.herokuapp.com/api/getcurrentaplication", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log("Get Current App", responseText);

        if (responseText.status === "success") {
          this.setState({
            loanuniqueno: responseText.data[0].name,
            loanamount: responseText.data[0].requested_loan_amount__c,
            termsinweeks: responseText.data[0].terms_in_weeks__c,
            appliedon: moment(
              responseText.data[0].contract_signed_time_stamp__c
            ).format("DD-MM-YYYY"),
          });
        } else {
          alert(responseText.message);
        }
      })
      .catch((error) => {
        // alert(error);
      });

    fetch("https://cityfinance-app.herokuapp.com/api/loanBalance", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log("Get Current App", responseText);

        if (responseText.status === "success") {
          this.setState({
            loanbalanceamount: responseText.data[0].loan__loan_amount__c,
          });
        } else {
          alert(responseText.message);
        }
      })
      .catch((error) => {
        // alert(error);
      });

    fetch("https://cityfinance-app.herokuapp.com/api/userprofile", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
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
  };

  selectDocument = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      includeBase64: true,
      includeExif: true,
      compressImageQuality: 0.1,
    }).then((image) => {
      console.log("image>>>", image);
      this.setState({
        isSelectImage: image,
        imagetype: image?.mime,
        imagePath: image?.path,
      });
      this.state.imageDocument.push(image);
      console.log("imageState", this.state.imageDocument);
      this.setState({ uploadDoc: false, documentuploaded: true });
      this.getApplicationDocuments();
    });
  };

  getApplicationDocuments = () => {
    console.log("Parameters>>>", {
      uri: this.state.imagePath,
      type: this.state.imagetype,
      name: "image.png",
    });
    const RegisterData = new FormData();
    RegisterData.append("file", {
      uri: this.state.imagePath,
      type: this.state.imagetype,
      name: "image.png",
    });
    RegisterData.append("applicationid", "aAr1e00000000QbCAI");
    console.log("RegisterData", JSON.stringify({ RegisterData }));
    fetch("https://cityfinance-app.herokuapp.com/api/uplodeuserDocument", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "multipart/form-data", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
      body: RegisterData,
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log("getApplicationDocuments", responseText);
      })
      .catch((error) => {
        console.log("getApplicationDocuments error", error);

        // alert(error);
      });
  };

  uploadDocument = () => {
    this.setState({ uploadDoc: true });
  };

  toggleOpen = () => {
    this.setState({ opendrawer: !this.state.opendrawer });
  };

  Logout = () => {
    AsyncStorage.setItem("login", "false").catch((err) => {
      console.log("error is: " + err);
    });
    AsyncStorage.setItem("token", "").catch((err) => {
      console.log("error is: " + err);
    });
    this.props.navigation.navigate("LoginScreen");
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
              // onPress={() => this.props.navigation.navigate("HomeScreen")}
              onPress={() => this.props.navigation.navigate("HomeScreen")}
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

  ReferanceAPICall = () => {
    if (this.state.firstnamereq === "") {
      alert("Please Provide Firstname!");
    } else if (this.state.lastnamereq == "") {
      alert("Please Provide Lastname!");
    } else if (this.state.relationshipreq == "") {
      alert("Please Provide Relationship!");
    } else {
      fetch("https://cityfinance-app.herokuapp.com/api/savereferanceByloan", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json", // <-- Specifying the Content-Type
          Authorization: "Bearer " + this.state.authToken,
        }),
        body: JSON.stringify({
          phone_number__c: "0000000000",
          first_name__c: this.state.firstnamereq,
          name: this.state.firstnamereq + this.state.lastnamereq,
          relationship__c: this.state.relationshipreq,
          last_name__c: this.state.lastnamereq,
        }),
      })
        .then((response) => response.json())
        .then((responseText) => {
          console.log(" responseText.token", responseText.data);
          if (responseText.status === "success") {
            this.setState({
              firstnamereq: "",
              relationshipreq: "",
              lastnamereq: "",
              thankyoufunded: true,
            });
            alert("Reference Added Successfully!");

            console.log(responseText);
          } else {
          }
        })
        .catch((error) => {
          // alert("Getting Error", error);
        });
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.requestaloan}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 350,
                width: 320,
                backgroundColor: "white",
                alignSelf: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
                  marginTop: 30,
                  maxWidth: 250,
                }}
              >
                {`Your loan balance as of ${moment(new Date()).format(
                  "DD-MM-YYYY"
                )} is:`}
              </Text>

              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 42,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#00AEA5",
                  marginTop: 30,
                  maxWidth: 250,
                }}
              >
                ${this.state.loanbalanceamount}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 14,
                  textAlign: "center",
                  color: "black",
                  marginTop: 30,
                  maxWidth: 250,
                }}
              >
                There may be pending payments on this account which coauld
                affects your loan balance or status on all current loan tiles
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ requestaloan: false })}
                style={{
                  width: "50%",
                  height: 50,
                  backgroundColor: "#FFCB05",
                  borderRadius: 50,
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: 20,
                  marginBottom: 20,
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
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.requestModal}
          onRequestClose={() => {
            this.setState({ requestModal: false });
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 230,
                width: 320,
                backgroundColor: "white",
                alignSelf: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
                  marginTop: 30,
                  maxWidth: 250,
                }}
              >
                Your Statement
              </Text>

              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  textAlign: "center",
                  color: "black",
                  marginTop: 20,
                  maxWidth: 250,
                }}
              >
                Your statement request has been sent. please allow up to 1
                buisness day for a response.
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ requestModal: false })}
                style={{
                  width: "50%",
                  height: 50,
                  backgroundColor: "#FFCB05",
                  borderRadius: 50,
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: 25,
                  marginBottom: 20,
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
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
                Dashboard
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://cityfinance.com.au/")}
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
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 22,
                color: "white",
                fontWeight: "400",
                marginTop: "4%",
                color: "#fff",
                fontWeight: "bold",
              }}
            ></Text>
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                backgroundColor: "white",
                borderRadius: 15,
                elevation: 5,
                marginTop: 10,
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "500",
                    marginTop: 20,
                    marginStart: 13,
                  }}
                >
                  Make a payment
                </Text>
                <TouchableOpacity
                  style={{
                    width: 160,
                    height: 55,
                    backgroundColor: "#000",
                    borderTopStartRadius: 35,
                    borderBottomStartRadius: 35,
                    borderTopEndRadius: 20,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      alignSelf: "center",
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    should not be able to pay more then balance due
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 15,
                  alignSelf: "center",
                }}
              >
                {this.state.loanuniqueno}
              </Text>
              <View style={{ padding: 15, marginTop: 0 }}></View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                  alignSelf: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "600",
                      marginStart: 8,
                    }}
                  >
                    Amount
                  </Text>
                </View>

                <TextInput
                  placeholder="Amount"
                  onChangeText={(text) => this.setState({ firstnamereq: text })}
                  value={this.state.firstnamereq}
                  style={{
                    height: 50,
                    width: 185,
                    backgroundColor: "white",
                    borderRadius: 100,
                    elevation: 5,
                    paddingStart: 20,
                  }}
                ></TextInput>
              </View>

              <View
                style={{
                  alignSelf: "center",
                  width: "70%",
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("ThankyouScreen", { id: 1 })
                  }
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "#FFCB05",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    marginBottom: 15,
                    marginTop: 10,
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
                    MAKE A PAYMENT
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  alignSelf: "center",
                  width: "70%",
                  borderWidth: 1,
                  borderRadius: 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("CurrentLoan")}
                  style={{
                    width: "100%",
                    height: 25,
                    backgroundColor: "#fff",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    marginBottom: 15,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      alignSelf: "center",
                      color: "BLACK",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 15,
                  alignSelf: "center",
                  maxWidth: 300,
                  textAlign: "center",
                }}
              >
                There may be pending payments on this account which coauld
                affects your loan balance or status on all current loan tiles
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default MakeApayment;
