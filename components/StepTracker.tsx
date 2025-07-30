import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Accelerometer } from "expo-sensors";
import { Platform, PermissionsAndroid } from "react-native";

export function useStepTracker(targetSteps = 30) {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [targetCal, setTargetCal] = useState(0);

  const lastY = useRef(0);
  const lastTime = useRef(0);
  const counting = useRef(false);
  const timeoutRef = useRef(null);
  const subscriptionRef = useRef(null);

  const THRESHOLD = 0.2;
  const DELAY = 300;
  const RESET_DELAY = 800;

  // Derived calories (e.g. 100% = 240 kcal for 6000 steps @ 0.04 kcal/step)
  const calories = useMemo(() => {
    const perStepCal = 0.04;
    setTargetCal(Math.round(targetSteps * perStepCal * 100) / 100);
    return Math.round(steps * perStepCal * 100) / 100;
  }, [steps]);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleStep = useCallback(() => {
    setSteps((prev) => prev + 1);
  }, []);

  const handleAccelerometer = useCallback(
    ({ y }) => {
      const now = Date.now();
      if (
        Math.abs(y - lastY.current) > THRESHOLD &&
        !counting.current &&
        now - lastTime.current > DELAY
      ) {
        counting.current = true;
        lastY.current = y;
        lastTime.current = now;

        handleStep();

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          counting.current = false;
        }, RESET_DELAY);
      }
    },
    [handleStep]
  );

  useEffect(() => {
    let active = true;

    const setup = async () => {
      const granted = await requestPermissions();
      if (!granted || !active) return;

      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(available);
      if (!available) return;

      Accelerometer.setUpdateInterval(100);
      subscriptionRef.current = Accelerometer.addListener(handleAccelerometer);
    };

    setup();

    return () => {
      active = false;
      subscriptionRef.current?.remove();
      clearTimeout(timeoutRef.current);
    };
  }, [handleAccelerometer]);

  const reset = () => {
    setSteps(0);
    lastY.current = 0;
    lastTime.current = 0;
    counting.current = false;
    clearTimeout(timeoutRef.current);
  };

  return {
    steps,
    calories,
    target: targetSteps,
    isAvailable,
    targetCal,
    reset,
  };
}
