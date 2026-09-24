// Preferences Store - User preferences with AsyncStorage persistence

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserPreferences {
  // Time Preferences
  defaultStartTimeHours: number;
  defaultStartTimeMinutes: number;
  defaultEndTimeHours: number;
  defaultEndTimeMinutes: number;
  timePickerMinuteInterval: number;

  // App Preferences
  notificationsEnabled: boolean;
  biometricsEnabled: boolean;
}

interface PreferencesState extends UserPreferences {
  // State
  isLoaded: boolean;

  // Time Preferences Actions
  setDefaultStartTime: (hours: number, minutes: number) => void;
  setDefaultEndTime: (hours: number, minutes: number) => void;
  setTimePickerInterval: (interval: number) => void;

  // App Preferences Actions
  setNotificationsEnabled: (value: boolean) => void;
  setBiometricsEnabled: (value: boolean) => void;

  // General
  resetToDefaults: () => void;
  getPreferences: () => UserPreferences;
}

const defaultPreferences: UserPreferences = {
  defaultStartTimeHours: 8,
  defaultStartTimeMinutes: 0,
  defaultEndTimeHours: 17,
  defaultEndTimeMinutes: 0,
  timePickerMinuteInterval: 5,
  notificationsEnabled: true,
  biometricsEnabled: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Initial state from defaults
      ...defaultPreferences,
      isLoaded: false,

      // Time Preferences
      setDefaultStartTime: (hours, minutes) => {
        set({
          defaultStartTimeHours: hours,
          defaultStartTimeMinutes: minutes,
        });
      },

      setDefaultEndTime: (hours, minutes) => {
        set({
          defaultEndTimeHours: hours,
          defaultEndTimeMinutes: minutes,
        });
      },

      setTimePickerInterval: (interval) => {
        // Allowed values: 1, 5, 15, 30
        if ([1, 5, 15, 30].includes(interval)) {
          set({ timePickerMinuteInterval: interval });
        }
      },

      // App Preferences
      setNotificationsEnabled: (value) => {
        set({ notificationsEnabled: value });
      },

      setBiometricsEnabled: (value) => {
        set({ biometricsEnabled: value });
      },

      // General
      resetToDefaults: () => {
        set({
          ...defaultPreferences,
          isLoaded: true,
        });
      },

      getPreferences: (): UserPreferences => {
        const state = get();
        return {
          defaultStartTimeHours: state.defaultStartTimeHours,
          defaultStartTimeMinutes: state.defaultStartTimeMinutes,
          defaultEndTimeHours: state.defaultEndTimeHours,
          defaultEndTimeMinutes: state.defaultEndTimeMinutes,
          timePickerMinuteInterval: state.timePickerMinuteInterval,
          notificationsEnabled: state.notificationsEnabled,
          biometricsEnabled: state.biometricsEnabled,
        };
      },
    }),
    {
      name: 'app-preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Mark as loaded when hydration is complete
        if (state) {
          state.isLoaded = true;
        }
      },
      partialize: (state) => ({
        // All preferences are persisted
        defaultStartTimeHours: state.defaultStartTimeHours,
        defaultStartTimeMinutes: state.defaultStartTimeMinutes,
        defaultEndTimeHours: state.defaultEndTimeHours,
        defaultEndTimeMinutes: state.defaultEndTimeMinutes,
        timePickerMinuteInterval: state.timePickerMinuteInterval,
        notificationsEnabled: state.notificationsEnabled,
        biometricsEnabled: state.biometricsEnabled,
      }),
    }
  )
);
