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

export class Capturereference extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opendrawer: false,
      loanuniqueno: "",
      loanamount: "",
      termsinweeks: "",
      appliedon: "",
      requestaloan: false,
      loanbalanceamount: 0,
      username: "",
      firstnamereq: "",
      lastnamereq: "",
      relationshipreq: "",
      uploadDoc: false,
      imageDocument: [],
      isSelectImage: "",
      RegisterData: "",
      imagetype: "",
      imagePath: "",
      authToken: "",
      submitdocument: false,
      applieddocument: true,
      captureareferance: false,
      thankyoufunded: false,
      DocumentUpload: this.props.route.params.DocumentImages,
      curruntData: this.props.route.params.curruntData,

      relationshipList: [
        {
          relationship__c: "Father",
        },
        {
          relationship__c: "Mother",
        },
        {
          relationship__c: "Brother",
        },
        {
          relationship__c: "Sister",
        },
        {
          relationship__c: "Wife",
        },
        {
          relationship__c: "Husband",
        },
        {
          relationship__c: "Son",
        },
        {
          relationship__c: "Daughter",
        },
        {
          relationship__c: "Friend",
        },
        {
          relationship__c: "Best Friend",
        },
        {
          relationship__c: "Son in law",
        },
        {
          relationship__c: "Daughter in law",
        },
        {
          relationship__c: "Cousin",
        },
      ],

      RelationSelect: "Father",
      pushRef: [],
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
      captureareferance: false,
      thankyoufunded: true,
      uploadDoc: false,
      requestaloan: false,
    });
  };

  closeAllThankYou = () => {
    this.setState({
      thankyoufunded: false,
    });
  };

  async componentDidMount() {
    const AuthToken = await AsyncStorage.getItem("token");

    this.setState({ authToken: AuthToken });
    setTimeout(() => {
      this.callInit();
    }, 1000);
  }

  callInit = async () => {
    console.log("Get Current App >>");

    fetch("https://cityfinance-app.herokuapp.com/api/getreferanceByloan", {
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
          // this.setState({
          //   relationshipList: responseText.data,
          // });
        } else {
          alert(responseText.message);
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
      this.setState({
        thankyoufunded: true,
      });
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
        this.setState({
          captureareferance: false,
          thankyoufunded: true,
          uploadDoc: false,
          requestaloan: false,
          opendrawer: false,
        });
      })
      .catch((error) => {
        console.log("getApplicationDocuments error", error);

        // alert(error);
      });
  };

  uploadDocument = () => {
    this.setState({ uploadDoc: true, captureareferance: false });
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
    console.log("RelationSelect", this.state.RelationSelect);
    let reference = {
      phone_number__c: "0000000000",
      first_name__c: this.state.firstnamereq,
      name: this.state.firstnamereq + this.state.lastnamereq,
      relationship__c: this.state.RelationSelect,
      last_name__c: this.state.lastnamereq,
    };
    this.state.pushRef.push(reference);
    console.log("reference", reference);
    if (this.state.firstnamereq === "") {
      alert("Please Provide Firstname!");
    } else if (this.state.lastnamereq == "") {
      alert("Please Provide Lastname!");
    } else if (this.state.selectedCIty == "") {
      alert("Please Provide Relationship!");
    } else {
      fetch("https://cityfinance-app.herokuapp.com/api/save-reference", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json", // <-- Specifying the Content-Type
          Authorization: "Bearer " + this.state.authToken,
        }),
        body: JSON.stringify(reference),
      })
        .then((response) => response.json())
        .then((responseText) => {
          console.log("Click TO Sifgn", responseText);
          if (responseText.success === true) {
            this.setState({
              firstnamereq: "",
              relationshipreq: "",
              lastnamereq: "",
              thankyoufunded: true,
            });
            this.props.navigation.push("ClicktoSign", {
              ref: this.state.pushRef,
              DocumentImages: this.state.DocumentUpload,
              curruntData: this.state.curruntData,
            });
            // alert("Referance Added Successfully!");

            console.log(responseText);
          } else {
          }
        })
        .catch((error) => {
          // alert("Getting Error", error);
        });
    }
  };

  ChangeCity = (selectedCIty) => {
    console.log("Selected State", selectedCIty);
    this.setState({ RelationSelect: selectedCIty });
    // this.setState({ selectedCIty: selectedCIty, Town: selectedCIty });
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
                Home
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

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: "white",
                  fontWeight: "400",
                  marginTop: "4%",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Capture a reference:
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
                <View style={{ padding: 15, marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontWeight: "600",
                          marginStart: 8,
                        }}
                      >
                        First Name:
                      </Text>
                    </View>

                    <TextInput
                      placeholder="First Name"
                      onChangeText={(text) =>
                        this.setState({ firstnamereq: text })
                      }
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
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontWeight: "600",
                          marginStart: 8,
                        }}
                      >
                        Last Name:
                      </Text>
                    </View>

                    <TextInput
                      placeholder="Last Name"
                      onChangeText={(text) =>
                        this.setState({ lastnamereq: text })
                      }
                      value={this.state.lastnamereq}
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
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontWeight: "600",
                          marginStart: 8,
                        }}
                      >
                        Relationship:
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "50%",
                        borderBottomWidth: 1,
                      }}
                    >
                      <Picker
                        onValueChange={(itemValue, itemIndex) =>
                          this.ChangeCity(itemValue)
                        }
                        selectedValue={this.state.RelationSelect}
                        dropdownIconColor="#CA6C26"
                      >
                        {Object.entries(this.state.relationshipList).map(
                          ([key, v]) => (
                            <Picker.Item
                              label={v.relationship__c}
                              value={v.relationship__c}
                            />
                          )
                        )}
                      </Picker>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={{
                        width: "45%",
                        height: 50,
                        borderColor: "#FFCB05",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignSelf: "center",
                        marginBottom: 5,
                        marginTop: 25,
                        borderWidth: 2,
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
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.ReferanceAPICall()}
                      style={{
                        width: "45%",
                        height: 50,
                        backgroundColor: "#FFCB05",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignSelf: "center",
                        marginBottom: 5,
                        marginTop: 25,
                        marginStart: 15,
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
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Capturereference;
