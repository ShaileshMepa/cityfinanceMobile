import React, { Component } from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  PermissionsAndroid,
} from "react-native";
import MenuDrawer from "react-native-side-drawer";
import AsyncStorage from "@react-native-community/async-storage";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";

export class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      opendrawer: false,
      male: false,
      female: false,
      authToken: "",
      IMAGEARRAY: [],
      picture: "", // add image details in state
      ImagePhoto: null,
      openModal: false,
      profileImage: "",
      pin: "",
      phone: "",
      username: "",
      dob: "",
      city: "",
      state: "",
      country: "",
      Salutation: "",
      ID_Detail: "",
      Driver_license_number: "",
      stateofissue: "",
      Medicarecardnumber: "",
      Referencenumber: "",
      Cardcolour: "",
      relationshipList: [
        {
          mr: "Mrs",
        },
        {
          mr: "Mr",
        },
        {
          mr: "Ms",
        },
      ],
      colors: [
        {
          clr: "Red",
        },
        {
          clr: "Blue",
        },
        {
          clr: "Green",
        },
        {
          clr: "Orange",
        },
        {
          clr: "White",
        },
        {
          clr: "Black",
        },

        {
          clr: "Yellow",
        },
        {
          clr: "Purple",
        },
      ],
      RelationSelect: "Mrs",
    };
  }

  async componentDidMount() {
    const AuthToken = await AsyncStorage.getItem("token");
    const profileimage = await AsyncStorage.getItem("profileimage");
    console.log("profileimage", profileimage);

    if (profileimage === null) {
      this.setState({ picture: "" });
    } else {
      this.setState({ picture: profileimage });
    }
    this.setState({ authToken: AuthToken });
    console.log("authsss", AuthToken);
    setTimeout(() => {
      this.userProfile();
    }, 1200);
  }

  userProfile = () => {
    fetch("https://cityfinance-app.herokuapp.com/api/users-profile", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log("Get User Profile Detail", responseText);

        if (responseText.success === true) {
          this.setState({
            first_name: responseText?.data?.firstname,
            last_name: responseText?.data?.lastname,
            email: responseText?.data?.mailing_address,
            mobile: responseText?.data?.mobilephone,
            Cardcolour: responseText?.data?.card_colour,
            dob: responseText?.data?.date_of_birth,
            Driver_license_number: responseText?.data?.driving_license_number,
            ID_Detail: responseText?.data?.id_detail,
            Medicarecardnumber: responseText?.data?.medicare_card_number,
            Referencenumber: responseText?.data?.reference_number,
            RelationSelect: responseText?.data?.salutation,
            stateofissue: responseText?.data?.state_of_issue,
          });
        } else {
          // alert(responseText.message);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  updateProfile = () => {
    let formData = new FormData();
    formData.append("mobilephone", this.state.mobile);
    fetch("https://cityfinance-app.herokuapp.com/api/update-users-profile", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json", // <-- Specifying the Content-Type
        Authorization: "Bearer " + this.state.authToken,
      }),
      body: JSON.stringify({
        mobilephone: this.state.mobile,
        salutation: this.state.RelationSelect,
        birthdate: this.state.dob,
        email: this.state.email,
        ownerid: this.state.ID_Detail,
        cf_type_c: "Medicare",
        card_numberc: this.state.Medicarecardnumber,
        state_of_issuec: this.state.stateofissue,
        reference_noc: this.state.Referencenumber,
        medicare_card_colorc: this.state.Cardcolour,
      }),
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log("Update Profile", responseText);
        alert("User profile updated successfully");
        this.userProfile();
        // this.props.navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        console.log("getApplicationDocuments error", error);

        alert(error);
      });
  };

  toggleOpen = () => {
    this.setState({ opendrawer: !this.state.opendrawer });
  };

  genderMale = () => {
    this.setState({ male: !this.state.male, female: false });
  };

  genderFemale = () => {
    this.setState({ female: !this.state.female, male: false });
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
                <View style={{ marginStart: 15 }}>
                  <Text
                    style={{ fontSize: 20, fontWeight: "600", color: "white" }}
                  >
                    User Name
                  </Text>
                  <TouchableOpacity onPress={() => this.toggleOpen()}>
                    <Text style={{ fontSize: 18, color: "white" }}>
                      Edit profile
                    </Text>
                  </TouchableOpacity>
                </View>
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
            onPress={() => this.Logout()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              marginStart: 22,
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

  //Image Edit Button Tap
  launchGallary = async () => {
    const options = {
      quality: 1,
    };

    //Image Picker Show Image picker
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let source = {
          uri: response.assets.uri,
          isStatic: true,
          type: response.assets.type,
          name: "ImageFirst.jpg",
        };
        console.log("IMage Listingss>>", response.assets);
        await AsyncStorage.setItem("profileimage", response.assets[0].uri);

        this.setState({
          picture: response.assets[0].uri, // add image details in state
          ImagePhoto: response.assets,
          openModal: false,
        });
      }
    });
  };

  launchCamera = async () => {
    const options = {
      quality: 0.6,
      storageOptions: {
        skipBackup: true,
      },
    };

    //Image Picker Show Image picker
    launchCamera(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let source = {
          uri: response.assets[0].uri,
          isStatic: true,
          type: response.assets[0].type,
          fileName: "ImageFirst.jpg",
        };
        // this.state.IMAGEARRAY.push(source);
        await AsyncStorage.setItem("profileimage", response.assets[0].uri);

        this.setState({
          picture: response.assets[0].uri, // add image details in state
          ImagePhoto: source,
          openModal: false,
        });
      }
    });
  };
  permissionCheck = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera",
          message: "THis app Access Camera permission!",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the location');
        this.launchCamera();
        // alert('You can use the location');
      } else {
        // alert('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  openImageModal = () => {
    this.setState({ openModal: true });
  };

  ChangeCity = (selectedCIty) => {
    console.log("Selected State", selectedCIty);
    this.setState({ RelationSelect: selectedCIty });
    // this.setState({ selectedCIty: selectedCIty, Town: selectedCIty });
  };

  ChangeCityColor = (selectedCIty) => {
    console.log("Selected State", selectedCIty);
    this.setState({ Cardcolour: selectedCIty });
    // this.setState({ selectedCIty: selectedCIty, Town: selectedCIty });
  };

  render() {
    const { male, female } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
            <TouchableOpacity
              onPress={() => {
                Platform.OS == "android"
                  ? this.permissionCheck()
                  : this.launchCamera();
              }}
              style={{
                height: 50,
                borderRadius: 50,
                alignSelf: "center",
                backgroundColor: "#00AEA5",
                justifyContent: "center",
                width: "90%",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: "center",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Select Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.launchGallary()}
              style={{
                height: 50,
                borderRadius: 50,
                alignSelf: "center",
                backgroundColor: "#00AEA5",
                justifyContent: "center",
                width: "90%",
                marginTop: "10%",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: "center",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                Select Gallary
              </Text>
            </TouchableOpacity>
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
              style={{ width: "100%", height: 200 }}
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
            <View style={{ marginBottom: "8%" }}>
              <TouchableOpacity onPress={() => this.updateProfile()}>
                <Text style={{ fontSize: 18, color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{ marginEnd: 16 }}></View> */}
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
                style={{ fontSize: 27, color: "white", fontWeight: "bold" }}
              >
                Edit Profile
              </Text>
            </View>
          </ScrollView>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        >
          <View style={{ width: 110, alignSelf: "center" }}>
            <Image
              style={{
                width: 110,
                height: 110,
                resizeMode: "contain",
                borderRadius: 100,
                marginTop: 20,
              }}
              source={
                this.state.picture === ""
                  ? require("../assets/photo.png")
                  : { uri: this.state.picture }
              }
            />
            {/* <TouchableOpacity
              onPress={() => this.openImageModal()}
              style={{
                width: 32,
                height: 32,
                resizeMode: "contain",
                alignSelf: "flex-end",
                bottom: "16%",
              }}
            >
              <Image
                style={{
                  width: 32,
                  height: 32,
                  resizeMode: "contain",
                  alignSelf: "flex-end",
                }}
                source={require("../assets/add_profile.png")}
              />
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: "5%",
            }}
          >
            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#000" }}>
                First Name
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"First Name"}
                onChangeText={(text) => this.setState({ first_name: text })}
                value={this.state.first_name}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}
            {/* <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginBottom: 10,
                marginTop: "5%",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#000" }}>
                Last Name
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Last Name"}
                onChangeText={(text) => this.setState({ last_name: text })}
                value={this.state.last_name}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginBottom: 10,
                marginTop: "5%",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#000" }}>
                Email
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Email Address"}
                onChangeText={(text) => this.setState({ email: text })}
                value={this.state.email}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View>
            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Phone Number
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Phone Number"}
                onChangeText={(text) => this.setState({ mobile: text })}
                value={this.state.mobile}
                placeholderTextColor={"#000000"}
              />
            </View>

            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Username
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Username"}
                onChangeText={(text) => this.setState({ username: text })}
                value={this.state.username}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Salutation
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <View
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderRadius: 10,
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
                      <Picker.Item label={v.mr} value={v.mr} />
                    )
                  )}
                </Picker>
              </View>
            </View>

            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                ID Detail
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"ID Detail"}
                onChangeText={(text) => this.setState({ ID_Detail: text })}
                value={this.state.ID_Detail}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                ID Detail
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"ID Detail"}
                onChangeText={(text) => this.setState({ ID_Detail: text })}
                value={this.state.ID_Detail}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View>

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Driver license number
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Driver license number"}
                onChangeText={(text) =>
                  this.setState({ Driver_license_number: text })
                }
                value={this.state.Driver_license_number}
                placeholderTextColor={"#000000"}
              />
            </View>

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                State of issue
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"state of issue"}
                onChangeText={(text) => this.setState({ stateofissue: text })}
                value={this.state.stateofissue}
                placeholderTextColor={"#000000"}
              />
            </View>

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Medicare card number
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Medicare card number"}
                onChangeText={(text) =>
                  this.setState({ Medicarecardnumber: text })
                }
                value={this.state.Medicarecardnumber}
                placeholderTextColor={"#000000"}
              />
            </View>

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Reference number
              </Text>
            </View>
            {/* <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Reference number"}
                onChangeText={(text) =>
                  this.setState({ Referencenumber: text })
                }
                value={this.state.Referencenumber}
                placeholderTextColor={"#000000"}
              />
            </View> */}

            <View style={{ width: "85%", alignSelf: "center" }}>
              <View
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              >
                <Picker
                  onValueChange={(itemValue, itemIndex) =>
                    this.ChangeCityColor(itemValue)
                  }
                  selectedValue={this.state.Cardcolour}
                  dropdownIconColor="#CA6C26"
                >
                  {Object.entries(this.state.colors).map(([key, v]) => (
                    <Picker.Item label={v.clr} value={v.clr} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Card colour
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Card colour"}
                onChangeText={(text) => this.setState({ Cardcolour: text })}
                value={this.state.Cardcolour}
                placeholderTextColor={"#000000"}
              />
            </View> */}

            <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Date of Birth
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Date of Birth"}
                onChangeText={(text) => this.setState({ dob: text })}
                value={this.state.dob}
                placeholderTextColor={"#000000"}
              />
            </View>

            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                City
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"City"}
                onChangeText={(text) => this.setState({ city: text })}
                value={this.state.city}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}

            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                State
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"State"}
                onChangeText={(text) => this.setState({ state: text })}
                value={this.state.state}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}

            {/* <View
              style={{ width: "90%", alignSelf: "center", marginBottom: 10 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: "5%",
                }}
              >
                Country
              </Text>
            </View>
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TextInput
                style={{
                  fontSize: 15,
                  fontFamily: "Poppins-Regular",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignItems: "center",
                  padding: 10,
                }}
                inputStyle={{ textAlign: "center" }}
                placeholder={"Country"}
                onChangeText={(text) => this.setState({ country: text })}
                value={this.state.country}
                placeholderTextColor={"#000000"}
                editable={false}
              />
            </View> */}
            {/* <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginBottom: 10,
                marginTop: "5%",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  Gender
                </Text>
              </View>
              <View
                style={{
                  width: "35%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  //   marginLeft: 20,
                }}
              >
                <TouchableOpacity onPress={() => this.genderMale()}>
                  <Text
                    style={
                      male === true ? styles.genderTrue : styles.genderFalse
                    }
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.genderFemale()}>
                  <Text
                    style={
                      female === true ? styles.genderTrue : styles.genderFalse
                    }
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  genderTrue: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  genderFalse: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProfile;
