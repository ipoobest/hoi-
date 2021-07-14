import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/base";
import "./plugins/chartist";
import "./plugins/vee-validate";
import "./plugins/vue-flag-icon";
import "./plugins/vue-page-transition";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import "./registerServiceWorker";

import lodash from "lodash";
import numeral from "numeral";
import moment from "moment";
import toastr from "toastr";
import crypto from "crypto";
import "toastr/build/toastr.min.css";
import Swal from "sweetalert2/src/sweetalert2.js";
import is from "is_js";
import { sprintf } from "sprintf-js";

import {
  ValidationObserver,
  ValidationProvider,
  localize,
  extend
} from "vee-validate";
import * as validationRules from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";
import th from "vee-validate/dist/locale/th.json";
import VueLazyload from "vue-lazyload";

Vue.use(VueLazyload);

lodash.forOwn(validationRules, (value, key) => {
  extend(key, value);
});

// Install English and Thai locales.
localize({
  en,
  th
});

Vue.config.productionTip = false;

localize("th");

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

Vue.prototype.$_ = lodash;
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$Numeral = numeral;
moment.locale("th");
moment.defaultFormat = moment.HTML5_FMT.DATETIME_LOCAL_MS + "ZZ";
Vue.prototype.$Moment = moment;
Vue.prototype.$Toastr = toastr;
Vue.prototype.$Swal = Swal;
Vue.prototype.$Is = is;
Vue.prototype.$Crypto = crypto;
Vue.prototype.$Sprintf = sprintf;

Vue.config.productionTip = false;
Vue.config.silent = true;

new Vue({
  vuetify,
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
