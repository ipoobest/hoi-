<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    width="310"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-divider class="mb-1" />

    <v-list class="ma-0 pb-0" nav>
      <v-list-item>
        <v-list-item-avatar class="align-self-center" contain>
          <v-img
            :src="require(`@/assets/logo-${customerNo}.png`)"
            max-height="40"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="display-2"
            style="text-transform: capitalize; font-weight: bold"
            v-text="profile.title"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list class="ma-0 pt-0" nav>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="subtitle-2">
            {{ $t("welcome_admin", [me.username]) }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-title class="body-2 text-right">{{
            $t(me.role.name.toLowerCase().split(" ").join("_"))
          }}</v-list-item-title>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children && !item.hidden"
          :key="`group-${i}`"
          :item="item"
          :number="i"
        >
          <!--  -->
        </base-item-group>

        <base-item v-else-if="!item.hidden" :key="`item-${i}`" :item="item" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>

    <!-- <template v-slot:append>
      <base-item
        :item="{
          title: $t('upgrade'),
          icon: 'mdi-package-up',
          to: '/upgrade'
        }"
      />
    </template> -->
  </v-navigation-drawer>
</template>

<script>
import { sync, get } from "vuex-pathify";

export default {
  name: "DashboardCoreDrawer",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    appName: process.env.VUE_APP_NAME,
    customerNo: process.env.VUE_APP_CUSTOMER_NO,
    items: []
  }),
  computed: {
    barColor: sync("global/barColor"),
    barImage: sync("global/barImage"),
    drawer: sync("global/drawer"),
    me: get("auth/me"),
    computedItems() {
      return this.items.map(this.mapItem);
    },
    profile() {
      return {
        avatar: true,
        title: this.appName
      };
    }
  },
  created() {
    this.items = [
      {
        icon: "mdi-view-dashboard",
        title: "dashboard",
        to: "/",
        hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
      },
      {
        title: "transaction",
        icon: "mdi-bank-transfer",
        group: "/transaction",

        children: [
          {
            title: "instant-transaction",
            to: "instant"
          },
          {
            title: "all-transaction",
            to: "all"
          },
          {
            title: "transaction_actions",
            to: "actions"
          },
          // {
          //   title: "promotion-transaction",
          //   to: "promotion",
          //
          // },
          {
            title: "reject-reason",
            to: "reject"
          }
        ]
      },
      {
        title: "member",
        icon: "mdi-account",
        group: "/member",

        children: [
          {
            title: "user-bank-account",
            to: "bank"
          },
          {
            title: "player-list",
            to: "player"
          },
          {
            title: "new-registrant",
            to: "new"
          },
          {
            title: "online-players",
            to: "online"
          },
          {
            title: "succeed-login",
            to: "login-succeed-logs"
          },
          {
            title: "failed-login",
            to: "login-failed-logs"
          },
          {
            title: "sms_notification",
            to: "sms",
            hidden: ["Approver"].includes(this.me.role.name)
          },
          {
            title: "sms_logs",
            to: "sms-logs",
            hidden: ["Approver"].includes(this.me.role.name)
          },
          {
            title: "member_setting",
            to: "setting",
            hidden: ["Partner", "Super Admin", "Approver"].includes(
              this.me.role.name
            )
          }
          // {
          //   title: "group-level",
          //   to: "group",
          //
          // },
          // {
          //   title: "tag-management",
          //   to: "tag",
          //
          // }
        ]
      },
      {
        title: "product",
        icon: "mdi-gamepad-variant",
        hidden: ["Super Admin", "Approver"].includes(this.me.role.name),
        group: "/product",

        children: [
          {
            title: "lotto",
            to: "lotto"
          },
          // {
          //   title: "casino",
          //   to: "casino",
          //
          // },
          {
            title: "game",
            to: "game"
          },
          // {
          //   title: "sport",
          //   to: "sport",
          //
          // },
          {
            title: "products-maintenance",
            to: "maintenance",
            hidden: ["Partner", "Super Admin", "Approver"].includes(
              this.me.role.name
            )
          }
        ]
      },
      {
        title: "total-bet",
        icon: "mdi-cash-multiple",
        group: "/total",

        hidden: ["Super Admin", "Approver"].includes(this.me.role.name),
        children: [
          {
            title: "outstanding",
            to: "outstanding",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          }
        ]
      },
      {
        title: "report",
        icon: "mdi-file-table",
        group: "/report",

        hidden: ["Super Admin", "Approver"].includes(this.me.role.name),
        children: [
          {
            title: "winloss_report",
            to: "winlose",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          },
          // {
          //   title: "winloss",
          //   to: "winloss"
          // },
          // {
          //   title: "profit-loss-report",
          //   to: "profit-loss"
          // },
          {
            title: "overall-report",
            to: "overall",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          },
          {
            title: "player-report",
            to: "player",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          }
        ]
      },
      {
        title: "finance",
        icon: "mdi-bank",
        group: "/finance",
        children: [
          {
            title: "company-bank-account",
            to: "company",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          },
          // {
          //   title: "bank-summary",
          //   to: "summary",
          //   hidden: ["Approver"].includes(this.me.role.name),
          //
          // },
          {
            title: "bank_transactions",
            to: "transactions"
          },
          {
            title: "bank-list",
            to: "list",
            hidden: ["Partner", "Super Admin", "Approver"].includes(
              this.me.role.name
            )
          },
          {
            title: "bank-filter",
            to: "filter",
            hidden: ["Partner", "Super Admin", "Approver"].includes(
              this.me.role.name
            )
          }
        ]
      },
      {
        title: "admin",
        icon: "mdi-briefcase-account",
        group: "/admin",

        hidden: ["Super Admin", "Approver"].includes(this.me.role.name),
        children: [
          {
            title: "admin-list",
            to: "list",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          },
          // {
          //   title: "role-permission",
          //   to: "permission"
          // },
          {
            title: "admin-logs",
            to: "logs",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          }
        ]
      },
      {
        title: "affiliate",
        icon: "mdi-share-variant",
        group: "/affiliate",

        hidden: ["Approver"].includes(this.me.role.name),
        children: [
          {
            title: "affiliate-list",
            to: "list",
            hidden: ["Approver"].includes(this.me.role.name)
          },
          {
            title: "affiliate-bonus-setting",
            to: "setting",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          },
          {
            title: "rerrefal-bonus",
            to: "bonus",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          },
          {
            title: "affiliate-statistic",
            to: "statistic",
            hidden: ["Super Admin", "Approver"].includes(this.me.role.name)
          }
        ]
      }
      // {
      //   title: "website",
      //   icon: "mdi-web",
      //   group: "/website",
      //   children: [
      //     {
      //       title: "announcement",
      //       to: "announcement",
      //
      //     }
      // {
      //   title: "banner",
      //   to: "banner",
      //
      // },
      // {
      //   title: "promotion-website",
      //   to: "promotion",
      //
      // },
      // {
      //   title: "seo",
      //   to: "seo",
      //
      // },
      // {
      //   title: "article",
      //   to: "article",
      //
      // }
      //   ]
      // }
      // {
      //   title: "agent",
      //   icon: "mdi-account-group",
      //   group: "/agent",
      //   children: [
      //     {
      //       title: "master-list",
      //       to: "master"
      //     },
      //     {
      //       title: "agent-list",
      //       to: "agent"
      //     },
      //     {
      //       title: "position-taking",
      //       to: "position"
      //     },
      //     {
      //       title: "ggr-setting",
      //       to: "ggr"
      //     },
      //     {
      //       title: "agent-report",
      //       to: "report"
      //     },
      //     {
      //       title: "transfer-payment",
      //       to: "transfer"
      //     }
      //   ]
      // }
    ];
  },
  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title)
      };
    }
  }
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
