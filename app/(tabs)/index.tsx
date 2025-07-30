import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import StepScreen from "../step";
// import ActivityRing from "@/components/ActivityRing";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import Banner from "@/components/Banner";
import { ScrollView } from "react-native-gesture-handler";
import { Session } from "@supabase/supabase-js";
import CalorieBanner from "@/components/ActivityRing";

const cycle = require("../../assets/images/cycle.png");
const yoga = require("../../assets/images/yoga.png");
const walk = require("../../assets/images/walk.png");

export default function TabOneScreen({ session }: { session: Session }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Header />
        <Banner />
        <View style={styles.stepsContainer}>
          {data.map((item, index) => (
            <Card data={item} index={index} key={index} />
          ))}
        </View>
        <CalorieBanner />
      </View>
    </ScrollView>
  );
}

const data = [
  {
    name: "Cycling",
    status: 85,
    image: cycle,
    lightColor: "#f8e4d9",
    color: "#fcf1ea",
    darkColor: "#fac5a4",
  },
  {
    name: "Walking",
    status: 25,
    image: walk,
    lightColor: "#d7f0f7",
    color: "#e8f7fc",
    darkColor: "#aceafc",
  },
  {
    name: "Yoga",
    status: 85,
    image: yoga,
    lightColor: "#dad5fe",
    color: "#e7e3ff",
    darkColor: "#8860a2",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // paddingTop: 10,
    // justifyContent: "center",
    flexDirection: "column",
  },
  stepScreenContainer: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  stepsContainer: {
    // flex: 1,
    // alignItems: "center",
    // width: "80%",
    // height: "30%",
    marginTop: 20,
    // justifyContent: "space-between",
    flexDirection: "row",
    // borderWidth: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "2%",
  },
});
