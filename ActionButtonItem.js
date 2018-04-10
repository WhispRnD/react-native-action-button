import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity
} from "react-native";
import {
  shadowStyle,
  alignItemsMap,
  getTouchableComponent,
  isAndroid,
  touchableBackground,
  DEFAULT_ACTIVE_OPACITY
} from "./shared";

const { width: WIDTH } = Dimensions.get("window");
const SHADOW_SPACE = 10;
const TEXT_HEIGHT = 22;

const TextTouchable = isAndroid
  ? TouchableNativeFeedback
  : TouchableWithoutFeedback;

export default class ActionButtonItem extends Component {
  static get defaultProps() {
    return {
      active: true,
      spaceBetween: 15,
      useNativeFeedback: true,
      activeOpacity: DEFAULT_ACTIVE_OPACITY,
      fixNativeFeedbackRadius: false,
      nativeFeedbackRippleColor: "rgba(255,255,255,0.75)"
    };
  }

  static get propTypes() {
    return {
      active: PropTypes.bool,
      useNativeFeedback: PropTypes.bool,
      fixNativeFeedbackRadius: PropTypes.bool,
      nativeFeedbackRippleColor: PropTypes.string,
      activeOpacity: PropTypes.number
    };
  }

  render() {
    const {
      size,
      position,
      verticalOrientation,
      hideShadow,
      spacing
    } = this.props;
    if (!this.props.active) return null;
    const animatedViewStyle = {
      marginBottom: -10,
      alignItems: alignItemsMap[position],

      // backgroundColor: this.props.buttonColor,
      opacity: this.props.anim,
      transform: [
        {
          translateY: this.props.anim.interpolate({
            inputRange: [0, 0],
            outputRange: [verticalOrientation === "down" ? -40 : 40, 0]
          })
        }
      ]
    };

    const buttonStyle = {
      justifyContent: "center",
      alignItems: "center",
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: this.props.buttonColor || this.props.btnColor
    };

    if (position !== "center")
      buttonStyle[position] = (this.props.parentSize - size) / 2;

    const Touchable = getTouchableComponent(this.props.useNativeFeedback);

    const parentStyle = isAndroid &&
      this.props.fixNativeFeedbackRadius
      ? {
          height: size,
          marginBottom: spacing,

          borderRadius: this.props.size / 2
        }
      : {
          height: size + SHADOW_SPACE + spacing
        };
    return (
      <Animated.View
        pointerEvents="box-none"
        style={[{alignSelf: 'flex-start', flex: 0, left: 9, right: 0},animatedViewStyle, parentStyle]}
      >
          <TouchableOpacity
            testID={this.props.testID}
            background={touchableBackground(
              this.props.nativeFeedbackRippleColor,
              this.props.fixNativeFeedbackRadius
            )}
            activeOpacity={this.props.activeOpacity || DEFAULT_ACTIVE_OPACITY}
            onPress={this.props.onPress}
          >
            <View style={[
              buttonStyle,
              !hideShadow ? {...shadowStyle, ...this.props.shadowStyle} : null,
                {right: 0}
            ]}>
              {this.props.children}
            </View>
          </TouchableOpacity>
        {this._renderTitle()}
      </Animated.View>
    );
  }

  _renderTitle() {
    if (!this.props.title) return null;

    const {
      textContainerStyle,
      hideLabelShadow,
      offsetX,
      parentSize,
      size,
      position,
      spaceBetween
    } = this.props;
    const offsetTop = Math.max(size / 2 - TEXT_HEIGHT / 2, 0);
    const positionStyles = { top: offsetTop };
    const hideShadow = hideLabelShadow === undefined
      ? this.props.hideShadow
      : hideLabelShadow;

    if (position !== "center") {
      positionStyles[position] =
        offsetX + (parentSize - size) / 2 + size + spaceBetween;
    } else {
      positionStyles.right = WIDTH / 2 + size / 2 + spaceBetween;
    }

    const textStyles = [
      styles.textContainer,
      positionStyles,
      !hideShadow && shadowStyle,
      textContainerStyle
    ];

    const title = (
      React.isValidElement(this.props.title) ?
        this.props.title
      : (
        <Text
          allowFontScaling={false}
          style={[styles.text, this.props.textStyle]}
        >
          {this.props.title}
        </Text>
      )
    )

    return (
      <TextTouchable
        background={touchableBackground(
          this.props.nativeFeedbackRippleColor,
          this.props.fixNativeFeedbackRadius
        )}
        activeOpacity={this.props.activeOpacity || DEFAULT_ACTIVE_OPACITY}
        onPress={this.props.onPress}
      >
        <View style={textStyles}>
          {title}
        </View>
      </TextTouchable>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    paddingVertical: isAndroid ? 2 : 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    backgroundColor: "white",
    height: TEXT_HEIGHT
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: "#444"
  }
});
