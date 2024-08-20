import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";

import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";

// React Native's Image component requires a source (a static asset/ or a URL)
// Here the source is required from the app's ./assets/images directory or it can come from the Network in the form of a uri property
const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* custom component from ImageViewer.js */}
        <ImageViewer placeholderImageSource={PlaceholderImage} />
      </View>

      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
      <StatusBar style="auto" />
      {/* The status bar is the zone typically at the top of the screen, that displays the current time, WiFi etc... the style changes colour, visibility etc */}
    </View>
  );
}
// also use braces to break out into code

/**
 * styling in React Native is done using JS (not CSS)
 * Most of the React Native core components accept a style prop
 * the style prop (style=) accepts a JS object as its value for the styling
 * eg View style={styles.container}
 * or Text style={{ color: "#fff" }}>
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
