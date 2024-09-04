import { StyleSheet, Image } from "react-native";

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  /**
   * The PlaceholderImage variable references
   * the ./assets/images/background-image.png and
   * is used as the source prop on the <Image> component.
   */
  const imageSource = selectedImage
    ? { uri: selectedImage }
    : placeholderImageSource;

  // the image picked from the image picker is a uri string, not a local asset like the placeholder image.
  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
