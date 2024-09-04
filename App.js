import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";

// React Native's Image component requires a source (a static asset/ or a URL)
// Here the source is required from the app's ./assets/images directory or it can come from the Network in the form of a uri property
const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const [showAppOptions, setShowAppOptions] = useState(false);
  // value of this variable will be set to true when the user picks an image from the media library or decides to use the placeholder image.

  const [selectedImage, setSelectedImage] = useState(null);
  // cause we want the selected image to trigger a re-render (hence making it a state variable)

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    /** The launchImageLibraryAsync() receives an object in which different options are specified.
     *      This object is an ImagePickerOptions object.
     *      We can pass the object to specify different options when invoking the method.
     *
     * When allowsEditing is set to true, the user can crop the image during the selection process on Android and iOS
     *
     * The pickImageAsync() function is responsible for invoking ImagePicker.launchImageLibraryAsync()
     * and then handling the result.
     * The launchImageLibraryAsync() method returns an object containing information about the selected image.
     *
     */

    if (!result.canceled) {
      // the result objects provides the assets array, which contains the uri of the selected image.
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(null);
    setPickedEmoji(null);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* custom component from ImageViewer.js */}
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
        {pickedEmoji && (
          <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
        )}
      </View>

      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            theme="primary"
            label="Choose a photo"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* The onSelect prop on the <EmojiList> component selects the emoji 
        and the onCloseModal prop closes the modal after emoji is selected. */}
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
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
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
