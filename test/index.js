import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { Animated, Easing, PanResponder, TouchableOpacity } from "react-native";

const Contianer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 300px;
`;

const Box = styled.View`
  width: 100px;
  height: 100px;
  background-color: pink;
`;

const AnimateBox = Animated.createAnimatedComponent(Box);

export default function Test() {
  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0, 
      y: 0,
    })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        POSITION.setOffset({
          x: POSITION.x._value,
          y: POSITION.y._value,
        })
      },
      onPanResponderMove: (_, { dx, dy }) => {
        POSITION.setValue({
          x: dx,
          y: dy,
        })
      },
      onPanResponderRelease: () => {
        POSITION.flattenOffset();
      },
    })
  ).current;

  const opacity = POSITION.y.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.5, 1],
  });

  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });

  const bgColor = POSITION.y.interpolate({
    inputRange: [-200, 100],
    outputRange: ["blue", "pink"],
  });

  return (
    <Contianer>
        <AnimateBox
          {...panResponder.panHandlers}
          style={{
            opacity,
            borderRadius,
            backgroundColor: bgColor,
            transform: [...POSITION.getTranslateTransform()],
          }}
        />
    </Contianer>
  );
}

