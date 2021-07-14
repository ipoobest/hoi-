<template>
  <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="toggleDrawer">
      <v-icon v-if="value">mdi-view-quilt</v-icon>

      <v-icon v-else>mdi-dots-vertical</v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$t($route.name)"
    />

    <v-spacer />

    <!-- <v-text-field
      :label="$t('search')"
      color="secondary"
      hide-details
      style="max-width: 165px;"
    >
      <template v-if="$vuetify.breakpoint.mdAndUp" v-slot:append-outer>
        <v-btn class="mt-n2" elevation="1" fab small>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <div class="mx-3" /> -->

    <!-- deposit succeed -->

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onDepositSucceedNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="green" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationDepositSucceedCount }}</span>
                </template>
                <v-icon size="25" v-bind="attr2" v-on="on2"
                  >mdi-bank-transfer-in</v-icon
                >
              </v-badge>
            </template>
            <span>{{ $t("deposit") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>

    <!-- deposit rejected -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onDepositFailedNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="red" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationDepositFailedCount }}</span>
                </template>
                <v-icon size="25" v-bind="attr2" v-on="on2"
                  >mdi-bank-transfer-in</v-icon
                >
              </v-badge>
            </template>
            <span>{{ $t("deposit") }}{{ $t("error3") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>
    <!-- withdrawal -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onWithdrawalNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="red" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationWithdrawalCount }}</span>
                </template>

                <v-icon size="25" v-bind="attr2" v-on="on2"
                  >mdi-bank-transfer-out</v-icon
                >
              </v-badge>
            </template>
            <span>{{ $t("withdrawal") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>
    <!-- adjustment -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onAdjustmentNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="orange" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationAdjustmentCount }}</span>
                </template>

                <v-icon size="23" v-bind="attr2" v-on="on2"
                  >mdi-account-edit</v-icon
                >
              </v-badge>
            </template>
            <span>{{ $t("adjustment") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>
    <!-- new user -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onNewUserNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="blue" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationNewUserCount }}</span>
                </template>

                <v-icon size="23" v-bind="attr2" v-on="on2"
                  >mdi-account-plus</v-icon
                >
              </v-badge>
            </template>
            <span>{{ $t("new-users") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>
    <!-- new user bank account -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onNewUserBankAccountNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="blue" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationNewUserBankAccountCount }}</span>
                </template>

                <v-icon size="18" v-bind="attr2" v-on="on2"
                  >mdi-bank-plus</v-icon
                >
              </v-badge>
            </template>
            <span>{{ $t("add_user_bank_account") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>
    <!-- lotto resulted -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click="onLottoResultedNotiClicked"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on: on2, attrs: attr2 }">
              <v-badge color="grey" overlap bordered>
                <template v-slot:badge>
                  <span>{{ notificationLottoResultedCount }}</span>
                </template>
                <v-icon size="20" v-bind="attr2" v-on="on2">mdi-bell</v-icon>
              </v-badge>
            </template>
            <span>{{ $t("result") }}</span>
          </v-tooltip>
        </v-btn>
      </template>
      <v-list :tile="false" nav>
        <app-bar-item v-for="i in notification" :key="i._id.toString()">
          <v-list-item class="pl-5 pr-5" @click="$router.push(i.link)">
            <v-list-item-title>
              {{ i.message.prefix
              }}<span :class="i.message.actionClass">{{
                i.message.action
              }}</span>
              <template v-if="i.message.status">
                <template v-if="i.message.isStrongStatus">
                  <strong>{{ i.message.status }}</strong>
                </template>
                <template v-else>
                  {{ i.message.status }}
                </template>
              </template>
              <template v-if="i.message.suffix">
                {{ i.message.suffix }}
              </template>
            </v-list-item-title>
          </v-list-item>
        </app-bar-item>
      </v-list>
    </v-menu>

    <v-btn class="ml-2" min-width="0" text to="/">
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <v-btn class="ml-2" min-width="0" text v-on="on">
          <v-icon>mdi-earth</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item-group v-model="$i18n.locale" mandatory>
          <v-list-item value="en" @click="changeLocal('en')">
            <v-list-item-avatar size="30">
              <v-img src="@/assets/flags/united-states-of-america.png"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>English</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="th" @click="changeLocal('th')">
            <v-list-item-avatar size="30">
              <v-img src="@/assets/flags/thailand.png"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>ภาษาไทย</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <template v-if="customerNo !== '12'">
      <v-tooltip v-if="soundOn" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            min-width="0"
            text
            v-bind="attrs"
            v-on="on"
            @click="soundOn = false"
          >
            <v-icon>volume_up</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("sound-off") }}</span>
      </v-tooltip>
      <v-tooltip v-else bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            min-width="0"
            text
            v-bind="attrs"
            v-on="on"
            @click="soundOn = true"
          >
            <v-icon>volume_off</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("sound-on") }}</span>
      </v-tooltip>
    </template>

    <v-btn class="ml-2" min-width="0" text @click="onLogoutClicked">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { sync } from "vuex-pathify";
import { authLocalLogout } from "@/api/authentication.js";
import { getNotification } from "@/api/notification.js";
import { updateUser } from "@/api/user.js";
// Components
// import { VHover, VListItem } from "vuetify/lib";
import { localize } from "vee-validate";

import io from "socket.io-client";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  name: "DashboardCoreAppBar",
  components: {
    // AppBarItem: {
    //   render(h) {
    //     return h(VHover, {
    //       scopedSlots: {
    //         default: ({ hover }) => {
    //           return h(
    //             VListItem,
    //             {
    //               attrs: this.$attrs,
    //               class: {
    //                 "black--text": !hover,
    //                 "white--text secondary elevation-12": hover
    //               },
    //               props: {
    //                 activeClass: "",
    //                 dark: hover,
    //                 link: true,
    //                 ...this.$attrs
    //               }
    //             },
    //             this.$slots.default
    //           );
    //         }
    //       }
    //     });
    //   }
    // }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    customerNo: process.env.VUE_APP_CUSTOMER_NO,
    notificationMode: "",
    notificationDepositSucceed: [],
    notificationDepositFailed: [],
    notificationWithdrawal: [],
    notificationAdjustment: [],
    notificationNewUser: [],
    notificationNewUserBankAccount: [],
    notificationLottoResulted: [],
    notificationDepositSucceedCount: 0,
    notificationDepositFailedCount: 0,
    notificationWithdrawalCount: 0,
    notificationAdjustmentCount: 0,
    notificationNewUserCount: 0,
    notificationNewUserBankAccountCount: 0,
    notificationLottoResultedCount: 0,
    notificationMessages: {
      prefix: "",
      action: "",
      actionClass: "",
      suffix: ""
    }
  }),
  computed: {
    drawer: sync("global/drawer"),
    me: sync("auth/me"),
    soundOn: sync("global/soundOn"),
    notification: function () {
      if (this.notificationMode === "deposit_succeed") {
        return this.notificationDepositSucceed;
      } else if (this.notificationMode === "deposit_failed") {
        return this.notificationDepositFailed;
      } else if (this.notificationMode === "withdrawal") {
        return this.notificationWithdrawal;
      } else if (this.notificationMode === "adjustment") {
        return this.notificationAdjustment;
      } else if (this.notificationMode === "new_user") {
        return this.notificationNewUser;
      } else if (this.notificationMode === "new_user_bank_account") {
        return this.notificationNewUserBankAccount;
      } else if (this.notificationMode === "lotto_resulted") {
        return this.notificationLottoResulted;
      } else {
        return [];
      }
    }
  },
  created() {
    this.audio = new Audio("/noti.mp3");
    this.initialLocale();
    this.connectWebSocket();
  },
  beforeDestroy() {
    if (this.worker) {
      clearTimeout(this.worker);
    }
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    initialLocale() {
      const locale = localStorage.getItem("locale");
      if (locale) {
        this.$i18n.locale = locale;
        this.$Moment.locale(locale);
        localize(locale);
        this.$store.set("global/locale", locale);
        this.$EventBus.$emit("onLocaleChanged", locale);
      }
      this.loadNotification();
    },
    connectWebSocket() {
      const iv = this.$Crypto.randomBytes(16);
      const cipher = this.$Crypto.createCipheriv(
        "aes-256-cbc",
        this.me.socketEncKey,
        iv
      );
      let encrypted = cipher.update(
        localStorage.getItem("jwt"),
        "utf8",
        "base64"
      );
      encrypted += cipher.final("base64");

      this.socket = io(process.env.VUE_APP_BASEURL, {
        query: {
          uid: this.me._id.toString(),
          enc: encrypted,
          iv: iv.toString("hex")
        },
        transports: ["websocket"]
      });
      this.socket.on("result", data => {
        this.onResult(data);
      });
      this.socket.on("payment", data => {
        this.$EventBus.$emit("onWebSocketPayment", data);
        this.loadNotification();
      });
      this.socket.on("user_bank_account", data => {
        this.$EventBus.$emit("onWebSocketUserBankAccount", data);
        this.loadNotification();
      });
      this.socket.on("new_user", data => {
        this.$EventBus.$emit("onWebSocketNewUser", data);
        this.loadNotification();
      });
      this.socket.on("user_login", data => {
        this.$EventBus.$emit("onWebSocketUserLogin", data);
      });
      this.socket.on("user_login_fail", data => {
        this.$EventBus.$emit("onWebSocketUserLoginFail", data);
      });
      this.socket.on("user_login_fail", data => {
        this.$EventBus.$emit("onWebSocketUserLoginFail", data);
      });
      this.socket.on("lotto_result", data => {
        this.$EventBus.$emit("onLottoResult", data);
        this.loadNotification();
      });
      this.socket.on("payment_transaction", data => {
        this.$EventBus.$emit("onWebSocketPaymentTransaction", data);
        this.loadNotification();
      });
      this.socket.on("rollback_processing", lotto => {
        this.onRollbackProcessing(lotto);
      });
      this.socket.on("rollback_finished", lotto => {
        this.onRollbackFinished(lotto);
      });
      this.socket.on("connect", () => {});
      this.socket.on("disconnect", () => {});
    },
    onLogoutClicked() {
      authLocalLogout()
        .then(() => {
          this.$router.replace("/login");
        })
        .catch(() => {
          this.$Swal.fire("Oops...", "Something went wrong!", "error");
        });
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    changeLocal(locale) {
      this.$i18n.locale = locale;
      this.$Moment.locale(locale);
      localize(locale);
      this.$store.set("global/locale", locale);
      localStorage.setItem("locale", locale);
      this.$EventBus.$emit("onLocaleChanged", locale);
      this.loadNotification();
    },
    async loadNotification() {
      if (this.worker) {
        return;
      }
      this.worker = setTimeout(() => {
        this.worker = null;
        this.fetchNotification();
      }, 5000);
    },
    async fetchNotification() {
      let playSound = false;
      const notification = await getNotification();
      // deposit succeed
      if (
        notification.depositSucceedCount > this.notificationDepositSucceedCount
      ) {
        playSound = true;
      }
      this.notificationDepositSucceedCount = notification.depositSucceedCount;
      this.notificationDepositSucceed = this.$_.map(
        notification.depositSucceed,
        n => {
          return {
            ...n,
            message: this.getNotiMessage(n),
            link: this.getNotiLink(n)
          };
        }
      );
      // deposit rejected
      if (
        notification.depositRejectedCount > this.notificationDepositFailedCount
      ) {
        playSound = true;
      }
      this.notificationDepositFailedCount = notification.depositRejectedCount;
      this.notificationDepositFailed = this.$_.map(
        notification.depositRejected,
        n => {
          return {
            ...n,
            message: this.getNotiMessage(n),
            link: this.getNotiLink(n)
          };
        }
      );
      // withdrawal
      if (notification.withdrawalCount > this.notificationWithdrawalCount) {
        playSound = true;
      }
      this.notificationWithdrawalCount = notification.withdrawalCount;
      this.notificationWithdrawal = this.$_.map(notification.withdrawal, n => {
        return {
          ...n,
          message: this.getNotiMessage(n),
          link: this.getNotiLink(n)
        };
      });
      // adjustment
      if (notification.adjustmentCount > this.notificationAdjustmentCount) {
        playSound = true;
      }
      this.notificationAdjustmentCount = notification.adjustmentCount;
      this.notificationAdjustment = this.$_.map(notification.adjustment, n => {
        return {
          ...n,
          message: this.getNotiMessage(n),
          link: this.getNotiLink(n)
        };
      });
      // new user
      if (notification.newUserCount > this.notificationNewUserCount) {
        playSound = true;
      }
      this.notificationNewUserCount = notification.newUserCount;
      this.notificationNewUser = this.$_.map(notification.newUser, n => {
        return {
          ...n,
          message: this.getNotiMessage(n),
          link: this.getNotiLink(n)
        };
      });
      // new user bank account
      if (
        notification.newUserBankAccountCount >
        this.notificationNewUserBankAccountCount
      ) {
        playSound = true;
      }
      this.notificationNewUserBankAccountCount =
        notification.newUserBankAccountCount;
      this.notificationNewUserBankAccount = this.$_.map(
        notification.newUserBankAccount,
        n => {
          return {
            ...n,
            message: this.getNotiMessage(n),
            link: this.getNotiLink(n)
          };
        }
      );
      // lotto resulted
      if (
        notification.lottoResultedCount > this.notificationLottoResultedCount
      ) {
        playSound = true;
      }
      this.notificationLottoResultedCount = notification.lottoResultedCount;
      this.notificationLottoResulted = this.$_.map(
        notification.lottoResulted,
        n => {
          return {
            ...n,
            message: this.getNotiMessage(n),
            link: this.getNotiLink(n)
          };
        }
      );
      if (playSound && this.soundOn) {
        this.playSound();
      }
    },
    getNotiLink(item) {
      if (["DEPOSIT", "WITHDRAWAL", "ADJUSTMENT"].includes(item.type)) {
        return "/transaction/" + item.itemId;
      } else if (item.type === "NEW_USER") {
        return "/member/" + item.itemId;
      } else if (item.type === "NEW_USER_BANK_ACCOUNT") {
        return "/member/bank";
      }
      return null;
    },
    getNotiMessage(item) {
      let prefix = "";
      let suffix = "";
      let action = "";
      let actionClass = "";
      let remark = "";
      if (item.remark) {
        remark = item.remark;
      }
      if (item.type === "DEPOSIT") {
        actionClass = "green--text";
        action = this.$t("deposit");
        prefix = this.$t("make_a") + " ";
      } else if (item.type === "WITHDRAWAL") {
        actionClass = "red--text";
        action = this.$t("withdrawal");
        prefix = this.$t("make_a") + " ";
      } else if (item.type === "ADJUSTMENT") {
        actionClass = "orange--text";
        action = this.$t("adjustment");
        prefix = this.$t("make_a") + " ";
      } else if (item.type === "NEW_USER") {
        actionClass = "red--text";
        action = remark;
        prefix = this.$t("welcome_new_user") + " ";
      } else if (item.type === "NEW_USER_BANK_ACCOUNT") {
        actionClass = "green--text";
        action = this.$t("add_user_bank_account");
        prefix = this.$t("make_a") + " ";
      } else if (item.type === "LOTTO_CALCULATE_FINISHED") {
        actionClass = "";
        action = this.$t("product_announced");
        const key = this.$_.upperFirst(
          getLangNameKeyFromLocale(this.$i18n.locale)
        );
        prefix = item["item" + key] + " ";
      }

      let status = "";
      let isStrongStatus = false;
      if (item.status === "WAITING") {
        status = " " + this.$t("waiting_review");
      } else if (item.status === "COMPLETED") {
        status = " " + this.$t("success");
        isStrongStatus = true;
      } else if (item.status === "REJECTED") {
        status = " " + this.$t("rejected");
        suffix = " " + remark;
        isStrongStatus = true;
      } else if (item.status === "FAILED") {
        status = " " + this.$t("error3");
        suffix = " " + remark;
        isStrongStatus = true;
      }
      let date = item.createdAt;
      if (item.notiAt) {
        date = item.notiAt;
      }
      return {
        prefix: this.$Moment(date).format("DD/MM/YYYY HH:mm:ss") + " " + prefix,
        action: action,
        actionClass: actionClass,
        suffix: suffix,
        status: status,
        isStrongStatus: isStrongStatus
      };
    },
    async onDepositSucceedNotiClicked() {
      this.notificationDepositSucceedCount = 0;
      this.notificationMode = "deposit_succeed";
      this.$store.set("auth/me@clickDepositSucceedNotificationAt", new Date());
      await updateUser({
        clickDepositSucceedNotificationAt: new Date()
      });
    },
    async onDepositFailedNotiClicked() {
      this.notificationDepositFailedCount = 0;
      this.notificationMode = "deposit_failed";
      this.$store.set("auth/me@clickDepositFailedNotificationAt", new Date());
      await updateUser({
        clickDepositFailedNotificationAt: new Date()
      });
    },
    async onWithdrawalNotiClicked() {
      this.notificationWithdrawalCount = 0;
      this.notificationMode = "withdrawal";
      this.$store.set("auth/me@clickWithdrawalNotificationAt", new Date());
      await updateUser({
        clickWithdrawalNotificationAt: new Date()
      });
    },
    async onAdjustmentNotiClicked() {
      this.notificationAdjustmentCount = 0;
      this.notificationMode = "adjustment";
      this.$store.set("auth/me@clickAdjustmentNotificationAt", new Date());
      await updateUser({
        clickAdjustmentNotificationAt: new Date()
      });
    },
    async onNewUserNotiClicked() {
      this.notificationNewUserCount = 0;
      this.notificationMode = "new_user";
      this.$store.set("auth/me@clickNewUserNotificationAt", new Date());
      await updateUser({
        clickNewUserNotificationAt: new Date()
      });
    },
    async onNewUserBankAccountNotiClicked() {
      this.notificationNewUserBankAccountCount = 0;
      this.notificationMode = "new_user_bank_account";
      this.$store.set(
        "auth/me@clickNewUserBankAccountNotificationAt",
        new Date()
      );
      await updateUser({
        clickNewUserBankAccountNotificationAt: new Date()
      });
    },
    async onLottoResultedNotiClicked() {
      this.notificationLottoResultedCount = 0;
      this.notificationMode = "lotto_resulted";
      this.$store.set("auth/me@clickLottoResultedNotificationAt", new Date());
      await updateUser({
        clickLottoResultedNotificationAt: new Date()
      });
    },
    onResult(data) {
      if (data.notification.status === "COMPLETED") {
        this.$EventBus.$emit("onLottoLayoutRefresh");
        this.$Swal.fire(
          this.$t("product_announced"),
          this.$t("product_announced") +
            " " +
            data.lotto[getLangNameKeyFromLocale(this.$i18n.locale)] +
            " " +
            this.$t("success"),
          "success"
        );
      } else if (data.notification.status === "FAILED") {
        this.$Swal.fire(
          this.$t("product_announced"),
          this.$t("product_announced") +
            " " +
            data.lotto[getLangNameKeyFromLocale(this.$i18n.locale)] +
            " " +
            this.$t("success"),
          "error"
        );
      }
    },
    onRollbackProcessing(lotto) {
      this.$EventBus.$emit("onLottoLayoutRefresh");
      this.$Swal.fire(
        this.$t("rollback"),
        this.$t("rollback_processing", [
          lotto[getLangNameKeyFromLocale(this.$i18n.locale)]
        ]),
        "warning"
      );
    },
    onRollbackFinished(lotto) {
      this.$EventBus.$emit("onLottoLayoutRefresh");
      this.$Swal.fire(
        this.$t("rollback"),
        this.$t("rollback_finished", [
          lotto[getLangNameKeyFromLocale(this.$i18n.locale)]
        ]),
        "success"
      );
    },
    playSound() {
      this.audio.currentTime = 0;
      this.audio.play();
    }
  }
};
</script>
