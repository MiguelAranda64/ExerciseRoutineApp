import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
import es from "./locales/es.json";
import en from "./locales/en.json";
 
const LANGUAGE_KEY = "@app_language";
 
// ─── Detecta el idioma guardado, fallback a español ───────────────────────────
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      callback(saved ?? "es");
    } catch {
      callback("es");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch {}
  },
};
 
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: "v4",
  });
 
export default i18n;
 
// Helper para cambiar idioma y guardarlo
export async function changeLanguage(lang) {
  await i18n.changeLanguage(lang);
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch {}
}