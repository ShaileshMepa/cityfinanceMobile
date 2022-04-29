import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  NetInfo,
  Platform,
} from "react-native";
import { DrawerActions } from "react-navigation-drawer";

export default class SideDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: "",
      isLoginUser: "",
      user_name: "",
      user_email: "",
      user_image: "",
      Device_Token: "",
      FCM_Device_Token: "",
      sideMenu: [],
      menu: [
        {
          title: "Home",
          // image: IMG.TabbarIcons.HomeTabSelectedIcon,
          routeName: "Home",
          key: "1",
        },
        {
          title: "Contact Us",
          // image: IMG.SideMenuIcons.ContactusIcon,
          routeName: "Contactus",
          key: "2",
        },
        {
          title: "Settings",
          // image: IMG.SideMenuIcons.SettingsIcon,
          routeName: "Settings",
          key: "3",
        },
        {
          title: "Booking Appointment",
          // image: IMG.SideMenuIcons.Logout,
          routeName: "CustomerBookAppointment",
          key: "4",
        },
        {
          title: "Logout",
          // image: IMG.SideMenuIcons.Logout,
          routeName: "Logout",
          key: "5",
        },
      ],
    };
  }

  render() {
    let PlaceHolderUser = IMG.PlaceHolderArrow;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text>Side Drawer</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollViewStyle: {
    marginTop: 8,
    flex: 1,
  },
  profileViewStyle: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    //borderBottomColor: CommonColors.DarkGreyColor,
    //borderBottomWidth: 2
  },
  profileImageStyle: {
    // marginTop: 16,
    width: 70,
    height: 70,
    alignSelf: "center",
    marginLeft: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
  },
});
