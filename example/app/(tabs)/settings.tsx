// Settings Screen - Theme only (minimal for SDK testing)

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Moon, Sun, Settings } from 'lucide-react-native';
import { useThemeStore } from '@stores/themeStore';
import { ThemeMode } from '@apptypes/enums';
import { ScreenLayout } from '@components/common/ScreenLayout';

export default function SettingsScreen() {
  const colors = useThemeStore((state) => state.colors);
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);

  return (
    <ScreenLayout safeArea padding={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            Settings
          </Text>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Appearance
          </Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            <View style={styles.themePickerContainer}>
              <View style={[styles.segmentedControl, { backgroundColor: colors.gray100 }]}>
                <Pressable
                  style={[
                    styles.segment,
                    themeMode === ThemeMode.Light && [styles.segmentActive, { backgroundColor: colors.card }],
                  ]}
                  onPress={() => setThemeMode(ThemeMode.Light)}
                >
                  <Sun size={16} color={themeMode === ThemeMode.Light ? colors.text : colors.textSecondary} />
                  <Text style={[styles.segmentText, { color: themeMode === ThemeMode.Light ? colors.text : colors.textSecondary }]}>
                    Light
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segment,
                    themeMode === ThemeMode.Dark && [styles.segmentActive, { backgroundColor: colors.card }],
                  ]}
                  onPress={() => setThemeMode(ThemeMode.Dark)}
                >
                  <Moon size={16} color={themeMode === ThemeMode.Dark ? colors.text : colors.textSecondary} />
                  <Text style={[styles.segmentText, { color: themeMode === ThemeMode.Dark ? colors.text : colors.textSecondary }]}>
                    Dark
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.segment,
                    themeMode === ThemeMode.System && [styles.segmentActive, { backgroundColor: colors.card }],
                  ]}
                  onPress={() => setThemeMode(ThemeMode.System)}
                >
                  <Settings size={16} color={themeMode === ThemeMode.System ? colors.text : colors.textSecondary} />
                  <Text style={[styles.segmentText, { color: themeMode === ThemeMode.System ? colors.text : colors.textSecondary }]}>
                    System
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Info */}
        <Text style={[styles.versionFooter, { color: colors.textSecondary }]}>
          Featurama SDK Tester v1.0.0
        </Text>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { paddingVertical: 8, marginBottom: 16 },
  screenTitle: { fontSize: 32, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: { borderRadius: 12, overflow: 'hidden' },
  themePickerContainer: { padding: 12 },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    width: '100%',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: { fontSize: 14, fontWeight: '500' },
  versionFooter: { fontSize: 12, textAlign: 'center', marginTop: 8 },
});
