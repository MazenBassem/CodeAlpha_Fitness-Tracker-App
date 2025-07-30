import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";
import { useStepTracker } from "./StepTracker";

const model = require("../assets/images/model.png");
const banner = require("../assets/images/BG.png");
const walkingAnimation = require("../assets/walking_blue.json");
const arrow = require("../assets/arrows.json");

export default function CalorieBanner() {
  const scheme = useColorScheme();
  const { steps, calories, target } = useStepTracker(300);

  const progress = calories / target;

  return (
    <ImageBackground style={styles.banner} source={{}}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.centerContent}>
          <Progress.Circle
            size={90}
            progress={progress}
            showsText
            formatText={() => `${Math.round(progress * 100)}%`}
            unfilledColor="#044331ff"
            borderColor="#3bad12ff"
            color="#FF6F00"
            direction="clockwise"
            fill="#044331ff"
            strokeCap="round"
            thickness={6}
            style={styles.progressCircle}
            textStyle={styles.progressText}
          />
          <Text style={styles.metricLabel}>Calories</Text>
          <Text style={styles.metricValue}>
            {calories} / {target} kcal
          </Text>
        </View>
        <View>
          <LottieView source={arrow} autoPlay loop style={styles.lottie} />
          <LottieView
            source={walkingAnimation}
            autoPlay
            loop
            style={[styles.lottie, { height: 90 }]}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 190,
    width: 370,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#272d2cff",
    shadowColor: "lightgrey",
    shadowOffset: { width: -5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  centerContent: {
    alignItems: "center",
    marginRight: 20,
    marginTop: 30,
  },
  progressCircle: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#88df1eff",
  },
  metricLabel: {
    fontSize: 20,
    color: "#88df1eff",
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 16,
    color: "#88df1eff",
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
  },
  lottie: {
    width: 100,
    height: 70,
    marginTop: 10,
    marginLeft: 10,
  },
  model: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 10,
    bottom: 285,
    zIndex: 10,
    height: "75%",
    width: "50%",
    transform: [{ rotateY: "180deg" }],
  },
});
