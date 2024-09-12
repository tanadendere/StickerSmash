import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Alert, useState, useRef } from "react";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";

import { GestureHandlerRootView } from "react-native-gesture-handler";
// The React Native Gesture Handler library provides a way to interact with the native platform's gesture response system.
// React Native Gesture Handler allows us to add behaviour when it detects touch input.

import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot"; // for android and iOS
import domtoimage from "dom-to-image"; // for web

// The react-native-view-shot library provides a method called captureRef() that captures a screenshot of a <View> in the app and returns the URI of the screenshot image file.

// React Native's Image component requires a source (a static asset/ or a URL)
// Here the source is required from the app's ./assets/images directory or it can come from the Network in the form of a uri property
const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  const imageRef = useRef();
  // REMEMBER : useRef() - allows you to persist values between renders. It can be used to store a mutable value that does not cause a re-render when updated.

  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }
  // Once permission is given, the value of the status changes to granted.

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
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement("a");
        link.download = "sticker-smash.jpeg";
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    // to get gesture interactions to work in the app, we'll render
    // <GestureHandlerRootView> from react-native-gesture-handler
    // to wrap the top-level component of our app (also known as the "root component").
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        {/* custom component from ImageViewer.js */}
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji && (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          )}
        </View>
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
      <StatusBar style="light" />
      {/* The status bar is the zone typically at the top of the screen, that displays the current time, WiFi etc... the style changes colour, visibility etc */}
    </GestureHandlerRootView>
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
