// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import { Pedometer } from "expo-sensors";
// import * as Location from "expo-location";
// import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

// const GOAL_STEPS = 10000; // Daily step goal

// const FitnessRing = () => {
//   const [currentSteps, setCurrentSteps] = useState(0);
//   const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
//   const [pastSteps, setPastSteps] = useState(0);
//   const [subscription, setSubscription] = useState(null);

//   // Request permissions
//   useEffect(() => {
//     const requestPermissions = async () => {
//       if (Platform.OS === "android") {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           alert("Permission to access activity data was denied");
//         }
//       }

//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission to access location was denied");
//       }
//     };

//     requestPermissions();
//   }, []);

//   // Subscribe to step updates
//   useEffect(() => {
//     const subscribe = async () => {
//       const isAvailable = await Pedometer.isAvailableAsync();
//       setIsPedometerAvailable(String(isAvailable));

//       if (isAvailable) {
//         const end = new Date();
//         const start = new Date();
//         start.setDate(end.getDate() - 1);

//         // Get past steps
//         const pastStepCountResult = await Pedometer.getStepCountAsync(
//           start,
//           end
//         );
//         if (pastStepCountResult) {
//           setPastSteps(pastStepCountResult.steps);
//         }

//         // Subscribe to step updates
//         const sub = Pedometer.watchStepCount((result) => {
//           setCurrentSteps(result.steps);
//         });

//         setSubscription(sub);
//       }
//     };

//     subscribe();

//     return () => {
//       subscription && subscription.remove();
//       setSubscription(null);
//     };
//   }, []);

//   // Calculate progress
//   const totalSteps = pastSteps + currentSteps;
//   const progress = Math.min(totalSteps / GOAL_STEPS, 1);
//   const circumference = 2 * Math.PI * 90;
//   const strokeDashoffset = circumference * (1 - progress);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Step Tracker</Text>

//       <Svg height="220" width="220" viewBox="0 0 220 220">
//         <G rotation="-90" origin="110, 110">
//           {/* Background circle */}
//           <Circle
//             cx="110"
//             cy="110"
//             r="90"
//             stroke="#e6e6e6"
//             strokeWidth="20"
//             fill="none"
//           />
//           {/* Progress circle */}
//           <Circle
//             cx="110"
//             cy="110"
//             r="90"
//             stroke="#007AFF"
//             strokeWidth="20"
//             strokeDasharray={circumference}
//             strokeDashoffset={strokeDashoffset}
//             strokeLinecap="round"
//             fill="none"
//           />
//         </G>

//         {/* Center text */}
//         <SvgText
//           x="110"
//           y="110"
//           textAnchor="middle"
//           alignmentBaseline="middle"
//           fontSize="24"
//           fontWeight="bold"
//           fill="#000"
//         >
//           {totalSteps}
//         </SvgText>
//         <SvgText
//           x="110"
//           y="140"
//           textAnchor="middle"
//           alignmentBaseline="middle"
//           fontSize="16"
//           fill="#666"
//         >
//           steps
//         </SvgText>
//       </Svg>

//       <Text style={styles.goalText}>
//         Goal: {GOAL_STEPS.toLocaleString()} steps
//       </Text>
//       <Text style={styles.statusText}>
//         Pedometer status: {isPedometerAvailable}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   goalText: {
//     marginTop: 30,
//     fontSize: 18,
//     color: "#666",
//   },
//   statusText: {
//     marginTop: 20,
//     fontSize: 14,
//     color: "#999",
//   },
// });

// export default FitnessRing;
