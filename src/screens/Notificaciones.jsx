import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
let Notifications = null;
import Constants from "expo-constants";

// ─── Detecta si estamos corriendo en Expo Go ──────────────────────────────
// En Expo Go SDK 53+, las notificaciones push remotas no están soportadas.
// Las notificaciones locales (scheduleNotificationAsync) sí funcionan en dev build.
const IS_EXPO_GO = Constants.executionEnvironment === "storeClient";

const STORAGE_KEY = "@notificaciones_prefs";

// ─── Configuration of notification behavior ───────────────────────────────
if (!IS_EXPO_GO) {
  Notifications = require("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function formatHour(date) {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

async function requestPermission() {
  if (IS_EXPO_GO) return false; // Don't request permissions in Expo Go since they won't work anyway
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (e) {
    console.warn("Error requesting notification permissions", e);
    return false;
  }
}

// Cancel and reschedule the workout reminder at the specified time (used when toggling on/off and when changing time)
// Use the correct trigger format for the current Expo SDK version (SDK 53+)
async function scheduleWorkoutReminder(hour, minute) {
  if (IS_EXPO_GO) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Hora de entrenar! 💪",
        body: "Tu sesión de hoy te está esperando.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (e) {
    console.warn("Error scheduling workout reminder", e);
  }
}

// ─── Main component ─────────────────────────────────────────────────

const Notificaciones = ({ navigation }) => {
  // Estado de toggles
  const [workoutReminder, setWorkoutReminder] = useState(false);
  const [logrosYMetas, setLogrosYMetas] = useState(false);
  const [novedades, setNovedades] = useState(false);

  // Hora del recordatorio
  const [reminderTime, setReminderTime] = useState(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });

  // DateTime Picker visibility (solo se muestra si el recordatorio de entrenamiento está activo)
  const [showPicker, setShowPicker] = useState(false);

  // ── Load saved preferences ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const saved = JSON.parse(raw);
        if (saved.workoutReminder !== undefined)
          setWorkoutReminder(saved.workoutReminder);
        if (saved.logrosYMetas !== undefined)
          setLogrosYMetas(saved.logrosYMetas);
        if (saved.novedades !== undefined) setNovedades(saved.novedades);
        if (saved.reminderTime) {
          const d = new Date();
          d.setHours(saved.reminderTime.hour, saved.reminderTime.minute, 0, 0);
          setReminderTime(d);
        }
      } catch (e) {
        console.warn("Error cargando preferencias:", e);
      }
    })();
  }, []);

  // ── Save preferences once they change ──────────────────────────
  async function savePrefs(overrides = {}) {
    const prefs = {
      workoutReminder,
      logrosYMetas,
      novedades,
      reminderTime: {
        hour: reminderTime.getHours(),
        minute: reminderTime.getMinutes(),
      },
      ...overrides,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn("Error guardando preferencias:", e);
    }
  }

  // ── Toggle recordatorio de entrenamiento ──────────────────────────────
  async function handleWorkoutToggle(value) {
    // In Expo Go, show an alert instead of trying to schedule notifications (which won't work)
    if (IS_EXPO_GO && value) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permiso requerido",
          "Activa las notificaciones en los ajustes de tu dispositivo para usar esta función.",
        );
        return;
      }
      await scheduleWorkoutReminder(
        reminderTime.getHours(),
        reminderTime.getMinutes(),
      );
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    setWorkoutReminder(value);
    savePrefs({ workoutReminder: value });
  }

  // ── Change time ──────────────────────────────────────────────────────
  async function handleTimeChange(event, selectedDate) {
    // In Android, the picker closes immediately after selecting a time, so we can save the new time right away. In iOS, we wait until the user presses "Done".
    if (Platform.OS === "android") setShowPicker(false);
    if (!selectedDate) return;

    setReminderTime(selectedDate);

    // If the workout reminder is active, reschedule it with the new time
    if (workoutReminder && !IS_EXPO_GO) {
      await scheduleWorkoutReminder(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
      );
    }

    savePrefs({
      reminderTime: {
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      },
    });
  }

  // ── Renders ────────────────────────────────────────────────────────────

  const renderToggleItem = ({
    icon,
    label,
    description,
    value,
    onValueChange,
    isFirst = false,
    isLast = false,
  }) => (
    <>
      <View
        style={[
          styles.item,
          isFirst && styles.itemFirst,
          isLast && styles.itemLast,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={20} color="#A47BFF" />
        </View>
        <View style={styles.itemTextGroup}>
          <Text style={styles.itemLabel}>{label}</Text>
          {description ? (
            <Text style={styles.itemDesc}>{description}</Text>
          ) : null}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#3D2070", true: "#7B3FE4" }}
          thumbColor={value ? "#D3BFFF" : "#6B4FAA"}
          ios_backgroundColor="#3D2070"
        />
      </View>
    </>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={28} color="#A47BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Informative Banner for Expo Go */}
        {IS_EXPO_GO && (
          <View style={styles.expoGoBanner}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#FBBF24"
            />
            <Text style={styles.expoGoBannerText}>
              Vista previa — Los recordatorios funcionan completos en el build
              de producción.
            </Text>
          </View>
        )}

        {/* ── Section: Workout Reminder ── */}
        <Text style={styles.sectionTitle}>Entrenamiento</Text>
        <View style={styles.card}>
          {renderToggleItem({
            icon: "barbell-outline",
            label: "Recordatorio diario",
            description: "Recibe un aviso para no saltarte tu sesión",
            value: workoutReminder,
            onValueChange: handleWorkoutToggle,
            isFirst: true,
            isLast: !workoutReminder,
          })}

          {/* Time Picker — visible only if the reminder is active */}
          {workoutReminder && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={[styles.item, styles.itemLast]}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <Ionicons name="time-outline" size={20} color="#A47BFF" />
                </View>
                <View style={styles.itemTextGroup}>
                  <Text style={styles.itemLabel}>Hora del recordatorio</Text>
                  <Text style={styles.itemDesc}>Toca para cambiar</Text>
                </View>
                <Text style={styles.timeChip}>{formatHour(reminderTime)}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* DateTimePicker (aparece como modal en iOS, inline en Android) */}
        {showPicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
            // In iOS we need a "Done" button to close the picker
            {...(Platform.OS === "ios" && {
              style: { backgroundColor: "#2A1660" },
            })}
          />
        )}
        {/* Botón "Listo" para cerrar el picker en iOS */}
        {showPicker && Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => setShowPicker(false)}
          >
            <Text style={styles.doneBtnText}>Listo</Text>
          </TouchableOpacity>
        )}

        {/* ── Sección: Actividad ── */}
        <Text style={styles.sectionTitle}>Actividad</Text>
        <View style={styles.card}>
          {renderToggleItem({
            icon: "trophy-outline",
            label: "Logros y metas",
            description: "Entérate cuando alcances un nuevo logro",
            value: logrosYMetas,
            onValueChange: (v) => {
              setLogrosYMetas(v);
              savePrefs({ logrosYMetas: v });
            },
            isFirst: true,
            isLast: true,
          })}
        </View>

        {/* ── Sección: App ── */}
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          {renderToggleItem({
            icon: "megaphone-outline",
            label: "Novedades y actualizaciones",
            description: "Nuevas funciones, rutinas y contenido",
            value: novedades,
            onValueChange: (v) => {
              setNovedades(v);
              savePrefs({ novedades: v });
            },
            isFirst: true,
            isLast: true,
          })}
        </View>

        {/* Nota de permiso del sistema */}
        <View style={styles.noteBox}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#7B5DB5"
          />
          <Text style={styles.noteText}>
            Para recibir notificaciones, asegúrate de que estén habilitadas en
            los ajustes de tu dispositivo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Estilos ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1E0F3A",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3D2070",
    gap: 12,
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  sectionTitle: {
    color: "#A47BFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingLeft: 4,
  },

  card: {
    backgroundColor: "#2A1660",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  itemFirst: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  itemLast: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },

  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#3D2070",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  itemTextGroup: {
    flex: 1,
    marginRight: 10,
  },

  itemLabel: {
    color: "#E0D0FF",
    fontSize: 15,
    fontWeight: "600",
  },

  itemDesc: {
    color: "#7B5DB5",
    fontSize: 12,
    marginTop: 2,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#3D2070",
    marginLeft: 64,
  },

  timeChip: {
    color: "#A47BFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  doneBtn: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#5A2D82",
    borderRadius: 8,
  },

  doneBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 4,
    marginTop: -8,
  },

  noteText: {
    flex: 1,
    color: "#6B4FAA",
    fontSize: 12,
    lineHeight: 18,
  },
});

export default Notificaciones;
