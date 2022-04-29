import React from "react";
import { Text, View, Image, StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

export default class splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotogome: "",
      loanstatus: "",
    };
  }

  retrivedData = async () => {
    this.login();
  };

  async login() {
    // const selectedCompany = await AsyncStorage.getItem('login');
    // console.log('Selected', selectedCompany);
    // if (selectedCompany === 'true') {
    //   this.props.navigation.navigate('GetLeackagrList');
    // } else {
    const Login = await AsyncStorage.getItem("login");
    const AuthToken = await AsyncStorage.getItem("token");

    this.setState({ authToken: AuthToken });
    if (Login === "true") {
      this.props.navigation.navigate("HomeScreen");

      // console.log("Get api/getcurrentloan", AuthToken);
      // fetch(
      //   "https://cityfinance-app.herokuapp.com/api/get-current-applications",
      //   {
      //     method: "GET",
      //     headers: new Headers({
      //       "Content-Type": "application/json", // <-- Specifying the Content-Type
      //       Authorization: "Bearer " + AuthToken,
      //     }),
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((responseText) => {
      //     console.log(
      //       "Get api/getcurrentloan Splash",
      //       responseText.data[0].application[0].genesis__status__c
      //     );

      //         this.props.navigation.navigate("HomeScreen");

      //   })
      //   .catch((error) => {
      //     // alert(error);
      //   });
    } else {
      this.props.navigation.navigate("LoginScreen");
    }
    console.log("Getting HOme>>>", Login);
    // this.props.navigation.navigate("login");

    // }
  }

  async componentDidMount() {
    setTimeout(() => {
      this.retrivedData();
    }, 4000);
  }

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}
      >
        <StatusBar barStyle={"light-content"} backgroundColor="#000" />

        {/* <GifImage
          source={{
            uri: 'https://www.wecaretlc.com/wp-content/uploads/Patient-Advocacy-v2.gif',
          }}
          style={{
            width: 350,
            height: 350,
            alignSelf: 'center',
          }}
          resizeMode={'contain'}
        /> */}
        <Image
          style={{
            height: "100%",
            width: "100%",
            alignSelf: "center",
            resizeMode: "stretch",
          }}
          source={require("../assets/cc_splash.png")}
        />

        {/* <Text style={{alignSelf: 'center', color: '#fff', fontSize: 30}}>
          Madicene Market
        </Text> */}
      </View>
    );
  }
}
