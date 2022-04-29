import React, { Component } from "react";
import { Text, View } from "react-native";
import StackNavigation from "./src/navigation/StackNavigation";

export class App extends Component {
  render() {
    return (
      <>
        <StackNavigation />
      </>
    );
  }
}

export default App;
