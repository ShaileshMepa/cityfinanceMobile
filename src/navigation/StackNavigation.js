import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screen/LoginScreen";
import HomeScreen from "../screen/HomeScreen";
import SplashScreen from "../screen/splash";
import Configure from "../screen/Configure";
import SuccessfullPin from "../screen/SuccessfullPin";
import PinAuth from "../screen/PinAuth";
import SideDrawer from "../screen/SideDrawer";
import ContactUs from "../screen/ContactUs";
import Notification from "../screen/Notification";
import SubmitDocs from "../screen/SubmitDocs";
import EditProfile from "../screen/EditProfile";
import CurrentLoan from "../screen/CurrentLoan";
import CurrentApplication from "../screen/CurrentApplication";
import Capturereference from "../screen/Capturereference";
import AddReferance from "../screen/AddReferance";
import DocumentScreen from "../screen/DocumentScreen";
import UploadDocument from "../screen/UploadDocument";
import ClicktoSign from "../screen/ClicktoSign";
import Documenttosign from "../screen/Documenttosign";
import ThankyouScreen from "../screen/ThankyouScreen";
import MakeApayment from "../screen/MakeApayment";

const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Configure" component={Configure} />
        <Stack.Screen name="SuccessfullPin" component={SuccessfullPin} />
        <Stack.Screen name="PinAuth" component={PinAuth} />
        <Stack.Screen name="SideDrawer" component={SideDrawer} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="SubmitDocs" component={SubmitDocs} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CurrentLoan" component={CurrentLoan} />
        <Stack.Screen name="Capturereference" component={Capturereference} />
        <Stack.Screen name="AddReferance" component={AddReferance} />
        <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
        <Stack.Screen name="UploadDocument" component={UploadDocument} />
        <Stack.Screen name="ClicktoSign" component={ClicktoSign} />
        <Stack.Screen name="Documenttosign" component={Documenttosign} />
        <Stack.Screen name="ThankyouScreen" component={ThankyouScreen} />
        <Stack.Screen name="MakeApayment" component={MakeApayment} />

        {/* <Stack.Screen
          name="CurrentApplication"
          component={CurrentApplication}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
