import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';

import en from './locales/en.json';
import id from './locales/id.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
};

const initI18n = async () => {
  let savedLanguage = await SecureStore.getItemAsync('user_language');
  
  if (!savedLanguage) {
    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode || 'en';
    savedLanguage = deviceLanguage === 'id' ? 'id' : 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
