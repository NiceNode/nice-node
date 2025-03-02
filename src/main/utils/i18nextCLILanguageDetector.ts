import type { InitOptions, LanguageDetectorModule, Services } from 'i18next';

export class I18nextCLILanguageDetector implements LanguageDetectorModule {
  static type = 'languageDetector' as const;

  type = I18nextCLILanguageDetector.type;
  services!: Services;
  detectorOptions?: object;
  i18nextOptions!: InitOptions;

  init(
    services: Services,
    detectorOptions: object,
    i18nextOptions: InitOptions,
  ): void {
    this.services = services;
    this.detectorOptions = detectorOptions;
    this.i18nextOptions = i18nextOptions;
  }

  detect(): string | string[] | undefined {
    const shellLocale =
      process.env.LC_ALL ??
      process.env.LC_MESSAGES ??
      process.env.LANG ??
      process.env.LANGUAGE;

    const language = this._getShellLanguage(shellLocale);
    if (language != null) {
      return language;
    }

    if (Array.isArray(this.i18nextOptions.fallbackLng)) {
      return [...this.i18nextOptions.fallbackLng];
    }

    if (typeof this.i18nextOptions.fallbackLng === 'string') {
      return this.i18nextOptions.fallbackLng;
    }

    return undefined;
  }

  cacheUserLanguage(): void {
    return;
  }

  /**
   * @see http://www.gnu.org/software/gettext/manual/html_node/The-LANGUAGE-variable.html
   */
  private _getShellLanguage(lc?: string): string | string[] | undefined {
    if (lc == null) return;

    const languages = lc
      .split(':')
      .map((language) =>
        language
          // Get `en_US` part from `en_US.UTF-8`
          .split('.')[0]
          // transforms `en_US` to `en-US`
          .replace('_', '-'),
      )
      .filter((language) =>
        this.services.languageUtils.isSupportedCode(language),
      )
      .map((language) =>
        this.services.languageUtils.formatLanguageCode(language),
      );

    // https://unix.stackexchange.com/questions/87745/what-does-lc-all-c-do
    if (languages.some((l) => l === 'C')) {
      return;
    }

    if (languages.length === 1 && languages[0] === '') {
      return;
    }

    if (languages.length === 1) {
      return languages[0];
    }

    return languages;
  }
}

export default I18nextCLILanguageDetector;
