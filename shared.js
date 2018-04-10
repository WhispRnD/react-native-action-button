import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback
} from "react-native";

export const DEFAULT_ACTIVE_OPACITY = 0.85;
/* Oval 5: */
// background-image: linear-gradient(-141deg, #ED2324 0%, #0074BC 100%);
// box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);

export const shadowStyle = {
  shadowOpacity: 0.5,
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowColor: "#000",
  shadowRadius: 2,
  elevation: 3
};

export const alignItemsMap = {
  center: "center",
  left: "flex-start",
  right: "flex-end"
};

export const isAndroid = Platform.OS === "android";

export function getTouchableComponent(useNativeFeedback) {
  if (useNativeFeedback === true && isAndroid === true) {
    return TouchableNativeFeedback;
  }
  return TouchableOpacity;
}

export function touchableBackground(color, fixRadius) {
  if (isAndroid) {
    if (Platform["Version"] >= 21) {
      return TouchableNativeFeedback.Ripple(
        color || "rgba(255,255,255,0.75)",
        fixRadius
      );
    } else {
      TouchableNativeFeedback.SelectableBackground();
    }
  }
  return undefined;
}
