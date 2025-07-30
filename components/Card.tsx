import React from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import * as Progress from "react-native-progress";

const next = require("../assets/images/next.png");

type CardProps = {
  data: CardData;
  index: number;
};

type CardData = {
  name: string;
  status: number;
  image: ImageSourcePropType;
  lightColor: string;
  color: string;
  darkColor: string;
};

export function Card({ data, index }: CardProps) {
  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: data.color,
          height: index === 1 ? 180 : 150,
        },
      ]}
    >
      <Image source={data.image} style={styles.icon} />
      <View style={styles.progressContainer}>
        <Progress.Circle
          size={50}
          progress={data.status / 100}
          showsText
          unfilledColor="#ededed"
          borderColor="#ededed"
          color={data.darkColor}
          direction="counter-clockwise"
          fill="white"
          strokeCap="round"
          thickness={5}
          style={styles.progressShadow}
          textStyle={styles.progressText}
        />
      </View>
      <View>
        <Text style={styles.metaText}>Day 1</Text>
        <Text style={styles.metaText}>Time 20 min</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.nameText}>{data.name}</Text>
        <View style={[styles.nextButton, { backgroundColor: data.lightColor }]}>
          <Image source={next} style={styles.nextIcon} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 10,
    alignSelf: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
    borderRadius: 10,
    shadowColor: "lightgrey",
    shadowOffset: { width: -5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  icon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  progressContainer: {
    alignSelf: "center",
    margin: 5,
  },
  progressShadow: {
    shadowColor: "grey",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  progressText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
  },
  metaText: {
    fontSize: 10,
    fontFamily: "Poppins-Light",
  },
  nameText: {
    fontFamily: "Poppins-Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextButton: {
    padding: 2,
    borderRadius: 10,
  },
  nextIcon: {
    height: 12,
    width: 12,
    resizeMode: "contain",
  },
});
