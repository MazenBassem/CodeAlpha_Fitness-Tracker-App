import React, { useEffect, useRef, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Pedometer } from "expo-sensors";
import { Accelerometer } from "expo-sensors";
import * as Progress from "react-native-progress";
import {
  ImageBackground,
  StyleSheet,
  useColorScheme,
  Image,
} from "react-native";
import { Text } from "react-native-paper";
import { View } from "./Themed";
import { useStepTracker } from "./StepTracker";
import LottieView from "lottie-react-native";

const model = require("../assets/images/model.png");
const banner = require("../assets/images/BG.png");

export default function Banner() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const { steps, calories, target, reset, isAvailable } = useStepTracker(30);
  // const [target, setTarget] = useState(6000); // default target steps
  const [progress, setProgress] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lastTimeStamp, setLastTimeStamp] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  // const animationRefRuning = useRef(null);
  // const animationRefSitting = useRef(null);

  // useEffect(() => {
  //   let subscription;
  //   Accelerometer.isAvailableAsync().then((result) => {
  //     if (result) {
  //       subscription = Accelerometer.addListener((accelerometerData) => {
  //         const { y } = accelerometerData;
  //         const threshold = 0.1;
  //         const timeStamp = new Date().getTime();

  //         if (
  //           Math.abs(y - lastY) > threshold &&
  //           !isCounting &&
  //           timeStamp - lastTimeStamp > 800 //adjust delay
  //         ) {
  //           setIsCounting(true);
  //           setLastY(y);
  //           setLastTimeStamp(timeStamp);
  const arrow = require("../assets/arrows.json");

  //           setProgress((prev) => prev + 1);
  //           setTimeout(() => {
  //             setIsCounting(false);
  //           }, 1200);
  //         }
  //       });
  //     } else {
  //       console.log("Accelerator not mounted");
  //     }
  //   });
  //   return () => {
  //     if (subscription) {
  //       subscription.remove();
  //     }
  //   };
  // }, [isCounting, lastY, lastTimeStamp]);

  // const resetSteps = () => {
  //   setProgress(0);
  // };

  const progressValue = useSharedValue(0);
  // const isDark = scheme === "dark";

  return (
    <>
      <ImageBackground style={styles.banner} source={banner}>
        <Progress.Circle
          size={100}
          progress={steps / target}
          showsText
          unfilledColor="#ededed"
          borderColor="#ededed"
          color={"#3f283aff"}
          direction="counter-clockwise"
          fill="#d2bfd2ff"
          strokeCap="round"
          thickness={20}
          style={styles.progressCircle}
          textStyle={styles.progressText}
        />
        <Text style={{ bottom: -110, left: -80, fontSize: 24, color: "white" }}>
          Steps
        </Text>
        <Text
          style={{ bottom: -140, left: -138, fontSize: 18, color: "white" }}
        >
          {steps}/{target}
        </Text>
      </ImageBackground>
      <Image source={model} style={styles.model} resizeMode="contain" />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 220,
    width: 370,
    marginTop: 20,
    padding: 30,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "lightgrey",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  bannerContainer: {
    // flex: 1,
    // borderWidth: 3,
    // flexDirection: "row",
  },
  label: { fontFamily: "Poppins-Medium", fontSize: 20, marginVertical: 10 },
  model: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 20,
    bottom: 277,
    zIndex: 10,
    height: "75%",
    width: "50%",
    transform: [{ rotateY: "180deg" }],
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  offer: { color: "white", fontFamily: "Poppins-Regular", fontSize: 10 },
  offerText: { color: "white", fontSize: 16, fontFamily: "Poppins-Regular" },
  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  fireContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressCircle: {
    marginLeft: 20,
    bottom: 30,
    shadowColor: "grey",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignSelf: "center",
  },
  progressText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
  },
});
