import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import {
  Animated,
  Easing,
  PanResponder,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { list } from "./icons";

export default function CardCheck() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });
  const secondCardScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
  });

  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const moveBack = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
    restSpeedThreshold: 100,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
    restSpeedThreshold: 100,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -320) {
          goLeft.start(onDismiss);
        } else if (dx > 320) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, moveBack]).start();
        }
      },
    })
  ).current;

  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    position.setValue(0);
    setIndex((prev) => prev + 1);
  };
  const closePress = () => {
    goLeft.start(onDismiss);
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };

  return (
    <Container>
      <CardContainer>
        <Card
          style={{
            transform: [{ scale: secondCardScale }],
          }}
        >
          <Ionicons name={list[index + 1]} size={89} color="#192a56" />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={list[index]} size={89} color="#192a56" />
        </Card>
      </CardContainer>

      <ButtonContainer>
        <Button onPress={closePress}>
          <Ionicons name="close-circle" size={50} color="white" />
        </Button>
        <Button onPress={checkPress}>
          <Ionicons name="checkmark-circle" size={50} color="white" />
        </Button>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  position: absolute;
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  elevation: 10;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 20px;
`;

const Button = styled.TouchableOpacity``;
