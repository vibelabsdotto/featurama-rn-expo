import { Platform, Dimensions } from 'react-native';
import type { DeviceInfoData } from './types';

/**
 * Collects device metadata using React Native core APIs.
 * Optionally uses expo-device and expo-constants if available (lazy require).
 */
export function collectDeviceInfo(): DeviceInfoData {
  const screen = Dimensions.get('screen');

  const info: DeviceInfoData = {
    platform:
      Platform.OS === 'ios'
        ? 'iOS'
        : Platform.OS === 'android'
          ? 'Android'
          : Platform.OS,
    osVersion: String(Platform.Version),
    deviceType: Math.min(screen.width, screen.height) >= 600 ? 'Tablet' : 'Phone',
    screenWidth: Math.round(screen.width * screen.scale),
    screenHeight: Math.round(screen.height * screen.scale),
    screenScale: screen.scale,
  };

  // Locale + timezone from Intl (available in Hermes/JSC)
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions();
    if (resolved.locale) info.locale = resolved.locale;
  } catch {
    // Intl not available
  }

  // Optional: expo-device for model/manufacturer (lazy require, no crash if missing)
  try {
    const ExpoDevice = require('expo-device');
    if (ExpoDevice.modelName) info.deviceModel = ExpoDevice.modelName;
    if (ExpoDevice.manufacturer) info.deviceManufacturer = ExpoDevice.manufacturer;
    if (ExpoDevice.deviceType != null) {
      const typeMap: Record<number, string> = {
        0: 'Unknown',
        1: 'Phone',
        2: 'Tablet',
        3: 'Desktop',
        4: 'TV',
      };
      info.deviceType = typeMap[ExpoDevice.deviceType] ?? info.deviceType;
    }
  } catch {
    // expo-device not installed
  }

  // Optional: expo-constants for app version (lazy require)
  try {
    const Constants = require('expo-constants');
    const manifest =
      Constants.default?.expoConfig ?? Constants.default?.manifest;
    if (manifest?.version) info.appVersion = manifest.version;
    if (Platform.OS === 'ios' && manifest?.ios?.buildNumber) {
      info.appBuild = manifest.ios.buildNumber;
    }
    if (Platform.OS === 'android' && manifest?.android?.versionCode) {
      info.appBuild = String(manifest.android.versionCode);
    }
  } catch {
    // expo-constants not installed
  }

  return info;
}
