import { StyleSheet, Image } from "react-native";

export default function ImageViewer({ placeholderImageSource }) {
  /**
   * The PlaceholderImage variable references
   * the ./assets/images/background-image.png and
   * is used as the source prop on the <Image> component.
   */
  return <Image source={placeholderImageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
