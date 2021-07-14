import Vue from "vue";
import VueI18n from "vue-i18n";

import en from "vuetify/lib/locale/en";
import th from "vuetify/lib/locale/th";

Vue.use(VueI18n);

const messages = {
  en: {
    ...require("@/locales/en.json"),
    $vuetify: en
  },
  th: {
    ...require("@/locales/th.json"),
    $vuetify: th
  }
};

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "th",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages
});
