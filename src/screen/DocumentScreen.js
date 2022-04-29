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

export class DocumentScreen extends Component {
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
      DocumentUpload: this.props.route.params.DocumentImages,
      isSelectImage: "",
      RegisterData: "",
      imagetype: "",
      imagePath: "",
      authToken: "",
      submitdocument: false,
      applieddocument: true,
      captureareferance: false,
      thankyoufunded: false,
      openModal: false,
      CurrSelectedImage: "",
      curruntData: this.props.route.params.curruntData,
      imageDocument1: null,
      imageDocument2: null,
      imageDocument3: null,
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
    console.log("DocumentUpload", this.state.DocumentUpload);
    const AuthToken = await AsyncStorage.getItem("token");

    this.setState({
      loanuniqueno: this.state.curruntData.name,
      loanamount: this.state.curruntData.requested_loan_amount__c,
      termsinweeks: this.state.curruntData.terms_in_weeks__c,
      appliedon: this.state.curruntData.createddate,
    });
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
          // alert(responseText.message);
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
          // alert(responseText.message);
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

  updateDocument = (item, index) => {
    this.selectDocument(index);
  };

  addDocument = () => {
    this.AddselectDocument();
  };

  AddselectDocument1 = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      includeBase64: false,
      includeExif: false,
      compressImageQuality: 0.1,
      multiple: false,
    }).then((image) => {
      // this.state.DocumentUpload.push(image);

      this.setState({ imageDocument1: image });
      // this.componentDidMount();
      // setTimeout(() => {
      //   this.getApplicationDocuments();
      // }, 500);
    });
  };

  AddselectDocument2 = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      includeBase64: false,
      includeExif: false,
      compressImageQuality: 0.1,
      multiple: false,
    }).then((image) => {
      // this.state.DocumentUpload.push(image);

      this.setState({ imageDocument2: image });
      // this.componentDidMount();
      // setTimeout(() => {
      //   this.getApplicationDocuments();
      // }, 500);
    });
  };

  AddselectDocument3 = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      includeBase64: false,
      includeExif: false,
      compressImageQuality: 0.1,
      multiple: false,
    }).then((image) => {
      // this.state.DocumentUpload.push(image);

      this.setState({ imageDocument3: image });
      // this.componentDidMount();
      // setTimeout(() => {
      //   this.getApplicationDocuments();
      // }, 500);
    });
  };

  selectDocument = (index) => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      includeBase64: false,
      includeExif: false,
      compressImageQuality: 0.1,
      multiple: false,
    }).then((image) => {
      let markers = [...this.state.DocumentUpload];
      console.log("getting this image>>", markers[index]);
      console.log("select this image>>", image);

      markers[index] = image;
      console.log("select this image>> Markers", markers);

      this.setState({ DocumentUpload: markers });
      // this.setState({ imageDocument: image });

      // setTimeout(() => {
      //   this.getApplicationDocuments();
      // }, 500);
    });
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
            alert("Refere+nce Added Successfully!");

            console.log(responseText);
          } else {
          }
        })
        .catch((error) => {
          // alert("Getting Error", error);
        });
    }
  };

  deleteDocument = (item, index) => {
    console.log(">>>", item);
    this.state.DocumentUpload.splice(index, 1);
    this.componentDidMount();
  };

  OpenModal = (item) => {
    console.log("item>> ", item.path);

    this.setState({ openModal: true, CurrSelectedImage: item.path });
  };

  GotoClick = () => {
    if (
      this.state.imageDocument1 === null ||
      this.state.imageDocument2 === null ||
      this.state.imageDocument3 === null
    ) {
      alert("Upload: Please upload 1 ID and 3 Payslips.");
    } else {
      this.props.navigation.navigate("ClicktoSign", {
        DocumentImages: this.state.DocumentUpload,
        curruntData: this.state.curruntData,
      });
    }
  };

  render() {
    // const { DocumentImages } = this.props.route.params;
    // console.log("DocumentImages", DocumentImages);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
          animationType="fade"
          visible={this.state.openModal}
          transparent={true}
          onRequestClose={() => {
            this.setState({ openModal: false });
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "lightgrey",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ openModal: false })}
              activeOpacity={1}
              style={{
                justifyContent: "center",
                height: 50,
                width: "20%",
                borderRadius: 50,
                backgroundColor: "white",
                alignSelf: "center",
                backgroundColor: "#00AEA5",
                position: "absolute",
                top: 10,
                right: 10,
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 17,
                    alignSelf: "center",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Close
                </Text>
              </View>
            </TouchableOpacity>

            <Image
              style={{
                width: "80%",
                height: "80%",
                resizeMode: "contain",
                alignSelf: "center",
              }}
              source={{ uri: this.state.CurrSelectedImage }}
            />
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
            {/* <TouchableOpacity
              onPress={() => this.handleBackButtonClick()}
              style={{ height: 50, alignSelf: "center" }}
            >
              <ImageBackground
                style={{ width: 34, height: 34 }}
                resizeMode="contain"
                source={require("../assets/whiteback.png")}
              ></ImageBackground>
            </TouchableOpacity> */}
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
            {this.state.applieddocument === true ? (
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: "white",
                    fontWeight: "400",
                    marginTop: "4%",
                    color: "#00AEA5",
                    fontWeight: "bold",
                  }}
                >
                  Upload Docs & Reference
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
                      {this.state.loanuniqueno}
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: 120,
                        height: 50,
                        backgroundColor: "#000",
                        borderTopStartRadius: 35,
                        borderBottomStartRadius: 35,
                        borderTopEndRadius: 20,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          alignSelf: "center",
                          color: "white",
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                      >
                        Awaiting Documents
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ padding: 15, marginTop: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <ImageBackground
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                          source={require("../assets/loan.png")}
                        ></ImageBackground>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 16,
                            fontWeight: "600",
                            marginStart: 8,
                          }}
                        >
                          Loan amount:
                        </Text>
                      </View>
                      <View style={{ width: "40%" }}>
                        <Text style={{ color: "#00AEA5", fontSize: 16 }}>
                          ${this.state.loanamount.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 14,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <ImageBackground
                          style={{ width: 20, height: 20 }}
                          resizeMode="center"
                          source={require("../assets/weeks.png")}
                        ></ImageBackground>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 16,
                            fontWeight: "600",
                            marginStart: 8,
                          }}
                        >
                          Term in weeks:
                        </Text>
                      </View>
                      <View style={{ width: "40%" }}>
                        <Text style={{ color: "#00AEA5", fontSize: 16 }}>
                          {this.state.termsinweeks}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 14,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <ImageBackground
                          style={{ width: 20, height: 20 }}
                          resizeMode="contain"
                          source={require("../assets/applied.png")}
                        ></ImageBackground>
                        <Text
                          style={{
                            color: "black",
                            fontSize: 16,
                            fontWeight: "600",
                            marginStart: 8,
                          }}
                        >
                          Applied on:
                        </Text>
                      </View>
                      <View style={{ width: "40%" }}>
                        <Text style={{ color: "#00AEA5", fontSize: 16 }}>
                          {moment(this.state.appliedon).format("DD-MM-YYYY")}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "flex-start",
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
                      Document:
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("UploadDocument")
                      }
                      style={{
                        width: "60%",
                        height: 50,
                        backgroundColor: "#FFCB05",
                        borderRadius: 50,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignSelf: "flex-end",
                        marginBottom: 15,
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          flexDirection: "column",
                          paddingRight: 10,
                        }}
                      >
                        <Image
                          source={require("../assets/upload.png")}
                          style={{ alignSelf: "center" }}
                        />
                        <Image source={require("../assets/upload2.png")} />
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          alignSelf: "center",
                          color: "white",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Upload Document
                      </Text>
                    </TouchableOpacity>
                  </View> */}

                  {/* <TouchableOpacity
                    onPress={() =>
                      this.state.imageDocument1 == null
                        ? null
                        : this.AddselectDocument1()
                    }
                    style={{
                      width: "60%",
                      height: 40,
                      backgroundColor: "#FFCB05",
                      borderRadius: 50,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignSelf: "flex-end",
                      marginBottom: 5,
                      marginEnd: 15,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "column",
                        paddingRight: 10,
                      }}
                    ></View>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      + Add More Document
                    </Text>
                  </TouchableOpacity> */}
                  <Text
                    style={{
                      fontSize: 12,
                      alignSelf: "center",
                      color: "white",
                      fontWeight: "bold",
                      color: "gray",
                      marginTop: 5,
                    }}
                  >
                    Please upload 1 ID Proof and 2 Payslips
                  </Text>
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignSelf: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.state.imageDocument1 != null
                          ? null
                          : this.AddselectDocument1()
                      }
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "90%",
                        backgroundColor: "#FFFFFF",
                        marginTop: "3%",
                        marginBottom: "3%",
                        padding: 8,
                        alignSelf: "center",
                        borderRadius: 10,
                        borderWidth: 1,
                      }}
                    >
                      {this.state.imageDocument1 != null ? (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              width: "5%",
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                              }}
                            >
                              1.
                            </Text>
                          </View>
                          <View
                            style={{
                              width: "72%",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                              }}
                            >
                              My ID
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => this.AddselectDocument1()}
                            style={{ width: "10%", alignItems: "flex-end" }}
                          >
                            <Image source={require("../assets/Edit.png")} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({ imageDocument1: null })
                            }
                            style={{ width: "10%", alignItems: "flex-end" }}
                          >
                            <Image source={require("../assets/delete.png")} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                                alignSelf: "center",
                              }}
                            >
                              + Please Upload My ID
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        this.state.imageDocument2 != null
                          ? null
                          : this.AddselectDocument2()
                      }
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "90%",
                        backgroundColor: "#FFFFFF",
                        marginTop: "3%",
                        marginBottom: "3%",
                        padding: 8,
                        alignSelf: "center",
                        borderRadius: 10,
                        borderWidth: 1,
                      }}
                    >
                      {this.state.imageDocument2 != null ? (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              width: "5%",
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                              }}
                            >
                              1.
                            </Text>
                          </View>
                          <View
                            style={{
                              width: "72%",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                              }}
                            >
                              Payslip 1
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => this.AddselectDocument2()}
                            style={{ width: "10%", alignItems: "flex-end" }}
                          >
                            <Image source={require("../assets/Edit.png")} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({ imageDocument2: null })
                            }
                            style={{ width: "10%", alignItems: "flex-end" }}
                          >
                            <Image source={require("../assets/delete.png")} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                                alignSelf: "center",
                              }}
                            >
                              + Please Upload Payslip 1
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        this.state.imageDocument3 != null
                          ? null
                          : this.AddselectDocument3()
                      }
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        width: "90%",
                        backgroundColor: "#FFFFFF",
                        marginTop: "3%",
                        marginBottom: "3%",
                        padding: 8,
                        alignSelf: "center",
                        borderRadius: 10,
                        borderWidth: 1,
                      }}
                    >
                      {this.state.imageDocument3 != null ? (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              width: "5%",
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                              }}
                            >
                              1.
                            </Text>
                          </View>
                          <View
                            style={{
                              width: "72%",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                              }}
                            >
                              Payslip 2
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => this.AddselectDocument3()}
                            style={{ width: "10%", alignItems: "flex-end" }}
                          >
                            <Image source={require("../assets/Edit.png")} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({ imageDocument3: null })
                            }
                            style={{ width: "10%", alignItems: "flex-end" }}
                          >
                            <Image source={require("../assets/delete.png")} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#000",
                                alignSelf: "center",
                              }}
                            >
                              + Please Upload Payslip 2
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* <FlatList
                      data={this.state.DocumentUpload}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.OpenModal(item)}
                            style={{
                              justifyContent: "space-between",
                              flexDirection: "row",
                              width: "90%",
                              backgroundColor: "#FFFFFF",
                              marginTop: "3%",
                              marginBottom: "3%",
                              padding: 8,
                              alignSelf: "center",
                              borderRadius: 10,
                              borderWidth: 1,
                            }}
                          >
                            <View
                              style={{
                                width: "5%",
                                alignSelf: "center",
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  color: "#000",
                                }}
                              >
                                {index + 1}.
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "60%",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  color: "#000",
                                }}
                              >
                                {index === 0
                                  ? "My ID"
                                  : index === 1
                                  ? "Payslip 1"
                                  : index === 2
                                  ? "Payslip 2"
                                  : ""}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => this.updateDocument(item, index)}
                              style={{ width: "10%", alignItems: "flex-end" }}
                            >
                              <Image source={require("../assets/Edit.png")} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.deleteDocument(item, index)}
                              style={{ width: "10%", alignItems: "flex-end" }}
                            >
                              <Image source={require("../assets/delete.png")} />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        );
                      }}
                    /> */}
                  </View>
                </View>
              </View>
            ) : null}

            {this.state.uploadDoc && (
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
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "500",
                      marginTop: 20,
                      alignSelf: "center",
                    }}
                  >
                    Require copy of your ID and Payslips
                  </Text>
                </View>
                <View style={{ padding: 15, marginTop: 10 }}>
                  <View
                    style={{
                      marginTop: 14,
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      <Text
                        style={{
                          color: "lightgrey",
                          fontSize: 16,
                          fontWeight: "600",
                          alignSelf: "center",
                        }}
                      >
                        Select File
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    width: "60%",
                    height: 50,
                    backgroundColor: "#FFCB05",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignSelf: "center",
                    marginBottom: 15,
                    marginTop: 10,
                  }}
                  onPress={() => this.selectDocument()}
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
                    UPLOAD
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => this.GotoClick()}
              style={{
                width: "90%",
                height: 50,
                backgroundColor: "#FFCB05",
                borderRadius: 50,
                justifyContent: "center",
                alignSelf: "center",
                // marginBottom: 15,
                marginTop: 20,
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
                Submit Document
              </Text>
            </TouchableOpacity>

            {this.state.documentuploaded === true ? (
              <View style={{ flex: 1 }}>
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
                      {this.state.loanuniqueno}
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: 120,
                        height: 50,
                        backgroundColor: "#000",
                        borderTopStartRadius: 35,
                        borderBottomStartRadius: 35,
                        borderTopEndRadius: 20,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          alignSelf: "center",
                          color: "white",
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                      >
                        Awaiting Documents
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ padding: 15, marginTop: 10 }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 16,
                        fontWeight: "600",
                        alignSelf: "center",
                      }}
                    >
                      Documents to sign
                    </Text>
                    <View
                      style={{
                        alignSelf: "center",
                        borderRadius: 5,
                        borderColor: "lightgrey",
                        borderWidth: 0.5,
                        width: "100%",
                        marginTop: 15,
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontSize: 16,
                            fontWeight: "600",
                            marginStart: 8,
                          }}
                        >
                          1. Loan Contract
                        </Text>
                      </View>

                      {/* <Text style={{ color: "#00AEA5", fontSize: 16 }}>
                    $2,100.00
                  </Text> */}
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "flex-start",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "40%",
                        height: 50,
                        borderColor: "#000",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignSelf: "flex-end",
                        marginBottom: 15,
                        marginTop: 10,
                        borderWidth: 2,
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
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.closeAll()}
                      style={{
                        width: "45%",
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
                        I AGREE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}

            {this.state.thankyoufunded === true ? (
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
                    {this.state.loanuniqueno}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: 120,
                      height: 50,
                      backgroundColor: "#000",
                      borderTopStartRadius: 35,
                      borderBottomStartRadius: 35,
                      borderTopEndRadius: 20,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Awaiting Documents
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 15, marginTop: 15 }}>
                  <Text
                    style={{
                      color: "#10AFA6",
                      fontSize: 40,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    THANK YOU
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "600",
                      alignSelf: "center",
                      marginTop: 10,
                      textAlign: "center",
                    }}
                  >
                    Thank you, your Additional payment for the amount $420.00
                    has been processed.
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: "center",
                    width: "50%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.closeAllThankYou()}
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
                      CONTINUE
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default DocumentScreen;
