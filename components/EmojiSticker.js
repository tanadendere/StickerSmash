import { View, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
// To animate between gesture states, we will use the Reanimated library.

import { Gesture, GestureDetector } from "react-native-gesture-handler";
// React Native Gesture Handler allows us to add behavior when it detects touch input, like a double tap event.

/**
 * The Animated component looks at the style prop of the component.
 * It also determines which values to animate and applies updates to create an animation.
 *
 * createAnimatedComponent lets you create an Animated version of any React Native component.
 *      wrapping a component with createAnimatedComponent allows Reanimated to animate
 *      any prop or style associated with that component
 *
 *          import Animated from 'react-native-reanimated';
 *          import { TextInput } from 'react-native';
 *
 *          const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
 *
 *
 * Reanimated comes with five built-in Animated components.
 *      i.e., it exports these animated components
 *              <Animated.View>, <Animated.Text>, <Animated.ScrollView>, Animated.FlatList, Animated.Image
 *
 * So the rest of the components you might want to animate in React Native have to be wrapped with
 * a createAnimatedComponent function (like example above).
 */

export default function EmojiSticker({ imageSize, stickerSource }) {
  /**
   * useSharedValue() hook helps mutate a piece of data
   *    it allows running animations based on the current value.
   *    can be a accessed and modified using the .value property
   */

  const scaleImage = useSharedValue(imageSize);
  // we want to scale the initial value of scaleImage so that when a user double-taps the sticker, it scales to twice its original size

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // These translation values will move the sticker around the screen.
  // Since the sticker moves along both axes, we need to track the X and Y values separately.

  // need to create a gesture object of type tap (it uses the Gesture.Tap() to animate the transition while scaling the sticker image)
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = imageSize;
      }
    });

  /** A pan gesture allows recognizing a dragging gesture and tracking its movement.
   * We will use it to drag the sticker across the image  - replace View with Animated.View.
   *
   * onChange() callback which runs when the gesture is active and is moving.
   *    The onChange() callback accepts event as a parameter.
   *    changeX and changeY properties hold the change in position since the last event.
   *    They are used to update the values stored in translateX and translateY.
   */

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  // withSpring() - a sring-based animation.

  /**
   * The useAnimatedStyle() hook is from react-native-reanimated
   *    used to create a style object that will be applied to the sticker image.
   *    it will update styles using the shared values when the animation happens.
   *
   * In this case, we are scaling the size of the image, which is done by manipulating the width and height properties.
   * The initial values of these properties are set to imageSize.
   *
   * The use the useAnimatedStyle() hook to return an array of transforms.
   * For the <Animated.View> component, we need to set the transform property to the translateX and translateY values.
   * This will change the sticker's position when the gesture is active.
   */

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        {/* GestureDetector always surrounds the animated component */}
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}

// can add styles to the style prop as an array in the style object.
// The appended styles will take precedence
