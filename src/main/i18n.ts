import i18n from 'i18next';
import enNotifications from '../../assets/locales/en/notifications.json';

i18n.init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      notifications: enNotifications,
    },
    // ... other languages ...
  },
});

export default i18n;
