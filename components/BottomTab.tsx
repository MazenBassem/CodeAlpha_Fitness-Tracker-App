import React from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";

// Import icons
const homeIcon = require("./assets/images/Home.png");
const heartIcon = require("./assets/images/H.png");
const calendarIcon = require("./assets/images/Calender.png");
const profileIcon = require("./assets/images/User.png");
const plusIcon = require("./assets/images/Plus.png");

const BottomTab = () => {
  const [activeTab, setActiveTab] = React.useState("home");

  return (
    <View style={styles.container}>
      <TabButton
        image={homeIcon}
        isActive={activeTab === "home"}
        onPress={() => setActiveTab("home")}
      />
      <TabButton
        image={heartIcon}
        isActive={activeTab === "heart"}
        onPress={() => setActiveTab("heart")}
      />

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => console.log("Plus pressed")}
      >
        <Image source={plusIcon} style={styles.plusIcon} resizeMode="contain" />
      </TouchableOpacity>

      <View style={styles.spacer} />
      <TabButton
        image={calendarIcon}
        isActive={activeTab === "calendar"}
        onPress={() => setActiveTab("calendar")}
      />
      <TabButton
        image={profileIcon}
        isActive={activeTab === "profile"}
        onPress={() => setActiveTab("profile")}
      />
    </View>
  );
};

const TabButton = ({ image, isActive, onPress }) => (
  <TouchableOpacity
    style={styles.tabButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image
      source={image}
      style={[styles.tabIcon, isActive && styles.activeTabIcon]}
      resizeMode="contain"
    />
    {isActive && <View style={styles.activeIndicator} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    left: 25,
    right: 25,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  activeTabIcon: {
    tintColor: "#8860a2",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: "30%",
    height: 2,
    backgroundColor: "#8860a2",
    borderRadius: 2,
  },
  plusButton: {
    position: "absolute",
    left: "50%",
    top: -25,
    marginLeft: -25,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plusIcon: {
    width: 30,
    height: 30,
    tintColor: "#8860a2",
  },
  spacer: {
    width: 40, // Space for the plus button
  },
});

export default BottomTab;
