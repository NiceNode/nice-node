export const changeLanguage = () => {};
export const useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => {},
    },
  };
};
