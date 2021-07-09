import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

import { authUsersMe } from "@/api/authentication.js";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: () => import("@/views/dashboard/Index"),
    meta: { requiresAuth: true },
    children: [
      // Dashboard
      {
        name: "dashboard",
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "@/views/dashboard/Dashboard"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Monitor Api"]
        }
      },
      // Transaction
      {
        name: "instant-transaction",
        path: "transaction/instant",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/transaction/pages/Instant"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "all-transaction",
        path: "transaction/all",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/transaction/pages/All"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "transaction_actions",
        path: "transaction/actions",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/transaction/pages/Actions"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "promotion-transaction",
        path: "transaction/promotion",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/transaction/pages/Promotion"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "reject-reason",
        path: "transaction/reject",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/transaction/pages/Reject"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "transaction",
        path: "transaction/:id",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/transaction/pages/Transaction"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      // Member
      {
        name: "user-bank-account",
        path: "member/bank",
        component: () =>
          import(/* webpackChunkName: "member" */ "@/views/member/pages/Bank"),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "player-list",
        path: "member/player",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/Player"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "new-registrant",
        path: "member/new",
        component: () =>
          import(/* webpackChunkName: "member" */ "@/views/member/pages/New"),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "online-players",
        path: "member/online",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/Online"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "succeed-login",
        path: "member/login-succeed-logs",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/SucceedLogs"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "failed-login",
        path: "member/login-failed-logs",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/FailedLogs"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "group-level",
        path: "member/group",
        component: () =>
          import(/* webpackChunkName: "member" */ "@/views/member/pages/Group"),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "tag-management",
        path: "member/tag",
        component: () =>
          import(/* webpackChunkName: "member" */ "@/views/member/pages/Tag"),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      {
        name: "sms_notification",
        path: "member/sms",
        component: () =>
          import(/* webpackChunkName: "member" */ "@/views/member/pages/Sms"),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin"]
        }
      },
      {
        name: "sms_logs",
        path: "member/sms-logs",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/SmsLogs"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin"]
        }
      },
      {
        name: "member_setting",
        path: "member/setting",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/Setting"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator"]
        }
      },
      {
        name: "member",
        path: "member/:id",
        component: () =>
          import(
            /* webpackChunkName: "member" */ "@/views/member/pages/Member"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      // Product
      {
        name: "product-lotto",
        path: "product/lotto",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Lotto"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "add-product-lotto",
        path: "product/lotto/add",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/AddProductLotto"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "lotto",
        path: "product/lotto/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/ManageRound"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "lotto-add",
        path: "product/lotto/:id/add",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/AddLotto"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "lotto-setting",
        path: "product/lotto/setting/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Setting"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "lotto-round-setting",
        path: "product/lotto/round/setting/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/RoundSetting"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "lotto-result",
        path: "product/lotto/result/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Result"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "yeekee",
        path: "product/lotto/yeekee/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/YeeKee"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "product-outstanding",
        path: "product/lotto/outstanding/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Outstanding"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "product-winloss",
        path: "product/lotto/winloss/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/WinLoss"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "game",
        path: "product/game",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Game"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "products-maintenance",
        path: "product/maintenance",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Maintenance"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "product_yeekee_details",
        path: "product/details/yeekee/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/YeekeeDetails"
          ),
        meta: { requiresAuth: true, roles: ["Partner"] }
      },
      {
        name: "product_details",
        path: "product/details/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/product/pages/Details"
          ),
        meta: { requiresAuth: true, roles: ["Partner"] }
      },
      // Total
      {
        name: "total-outstanding",
        path: "total/outstanding",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/total/pages/Outstanding"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "amount_by_type",
        path: "total/lotto/types/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/total/pages/LottoTypes"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "amount_by_number",
        path: "total/lotto/numbers/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/total/pages/LottoNumbers"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "amount_by_member",
        path: "total/lotto/members/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/total/pages/LottoMembers"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "total_lotto",
        path: "total/lotto/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/total/pages/ManageRound"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      // Report
      {
        name: "winloss_report",
        path: "report/winlose",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/WinLoss"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner"]
        }
      },
      {
        name: "report_amount_by_type",
        path: "report/lotto/types/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/report/pages/LottoTypes"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "report_amount_by_number",
        path: "report/lotto/numbers/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/report/pages/LottoNumbers"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "report_amount_by_member",
        path: "report/lotto/members/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/report/pages/LottoMembers"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "report_lotto",
        path: "report/lotto/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/report/pages/ManageRound"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "report_arena_amount_by_member",
        path: "report/arena/members/:id",
        component: () =>
          import(
            /* webpackChunkName: "total" */ "@/views/report/pages/ArenaMembers"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },      
      {
        name: "overall-report-product",
        path: "report/overall/product/:id",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/OverallProduct"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "overall-report-round",
        path: "report/overall/round/:id",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/OverallRound"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "report-winloss",
        path: "report/overall/winloss/:id",
        component: () =>
          import(
            /* webpackChunkName: "product" */ "@/views/report/pages/WinLoss"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "profit-loss-report",
        path: "report/profit-loss",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/ProfitLoss"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "overall-report",
        path: "report/overall",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/Overall"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "bet-number",
        path: "report/betnumber",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/BetNumber"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "player-report",
        path: "report/player",
        component: () =>
          import(
            /* webpackChunkName: "report" */ "@/views/report/pages/Player"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner"]
        }
      },
      // Finance
      {
        name: "company-bank-account",
        path: "finance/company",
        component: () =>
          import(
            /* webpackChunkName: "finance" */ "@/views/finance/pages/Company"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      // {
      //   name: "bank-summary",
      //   path: "finance/summary",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "finance" */ "@/views/finance/pages/Summary"
      //     ),
      //   meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      // },
      {
        name: "bank-list",
        path: "finance/list",
        component: () =>
          import(
            /* webpackChunkName: "finance" */ "@/views/finance/pages/List"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "bank-filter",
        path: "finance/filter",
        component: () =>
          import(
            /* webpackChunkName: "finance" */ "@/views/finance/pages/FilterTransaction"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "bank_transactions",
        path: "finance/transactions",
        component: () =>
          import(
            /* webpackChunkName: "finance" */ "@/views/finance/pages/BankTransactions"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin", "Approver"]
        }
      },
      // Admin
      {
        name: "admin-list",
        path: "admin/list",
        component: () =>
          import(/* webpackChunkName: "admin" */ "@/views/admin/pages/List"),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "role-permission",
        path: "admin/permission",
        component: () =>
          import(
            /* webpackChunkName: "admin" */ "@/views/admin/pages/Permission"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "admin-logs",
        path: "admin/logs",
        component: () =>
          import(/* webpackChunkName: "admin" */ "@/views/admin/pages/Logs"),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "admin-register",
        path: "admin/register",
        component: () =>
          import(
            /* webpackChunkName: "admin" */ "@/views/admin/pages/Register"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "admin",
        path: "admin/:id",
        component: () =>
          import(
            /* webpackChunkName: "transaction" */ "@/views/admin/pages/Admin"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      // Settiing
      {
        name: "announcement",
        path: "website/announcement",
        component: () =>
          import(
            /* webpackChunkName: "setting" */ "@/views/setting/pages/Announcement"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "banner",
        path: "website/banner",
        component: () =>
          import(
            /* webpackChunkName: "setting" */ "@/views/setting/pages/Banner"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "promotion-website",
        path: "website/promotion",
        component: () =>
          import(
            /* webpackChunkName: "setting" */ "@/views/setting/pages/Promotion"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "seo",
        path: "website/seo",
        component: () =>
          import(/* webpackChunkName: "setting" */ "@/views/setting/pages/SEO"),
        meta: { requiresAuth: true }
      },
      {
        name: "article",
        path: "website/article",
        component: () =>
          import(
            /* webpackChunkName: "setting" */ "@/views/setting/pages/Article"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      // Affiliate
      {
        name: "affiliate-list",
        path: "affiliate/list",
        component: () =>
          import(
            /* webpackChunkName: "affiliate" */ "@/views/affiliate/pages/List"
          ),
        meta: {
          requiresAuth: true,
          roles: ["Modulator", "Partner", "Super Admin"]
        }
      },
      {
        name: "affiliate-bonus-setting",
        path: "affiliate/setting",
        component: () =>
          import(
            /* webpackChunkName: "affiliate" */ "@/views/affiliate/pages/Setting"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "rerrefal-bonus",
        path: "affiliate/bonus",
        component: () =>
          import(
            /* webpackChunkName: "affiliate" */ "@/views/affiliate/pages/Bonus"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      {
        name: "affiliate-statistic",
        path: "affiliate/statistic",
        component: () =>
          import(
            /* webpackChunkName: "affiliate" */ "@/views/affiliate/pages/Statistic"
          ),
        meta: { requiresAuth: true, roles: ["Modulator", "Partner"] }
      },
      // Agent
      {
        name: "master-list",
        path: "agent/master",
        component: () =>
          import(/* webpackChunkName: "agent" */ "@/views/agent/pages/Master"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "agent-list",
        path: "agent/agent",
        component: () =>
          import(/* webpackChunkName: "agent" */ "@/views/agent/pages/Agent"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "position-taking",
        path: "agent/position",
        component: () =>
          import(
            /* webpackChunkName: "agent" */ "@/views/agent/pages/Position"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "ggr-setting",
        path: "agent/ggr",
        component: () =>
          import(/* webpackChunkName: "agent" */ "@/views/agent/pages/GGR"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "agent-report",
        path: "agent/report",
        component: () =>
          import(/* webpackChunkName: "agent" */ "@/views/agent/pages/Report"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "transfer-payment",
        path: "agent/transfer",
        component: () =>
          import(
            /* webpackChunkName: "agent" */ "@/views/agent/pages/Transfer"
          ),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      // Pages
      {
        name: "User Profile",
        path: "pages/user",
        component: () => import("@/views/dashboard/pages/UserProfile"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "Notifications",
        path: "components/notifications",
        component: () => import("@/views/dashboard/component/Notifications"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "Icons",
        path: "components/icons",
        component: () => import("@/views/dashboard/component/Icons"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      {
        name: "Typography",
        path: "components/typography",
        component: () => import("@/views/dashboard/component/Typography"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      // Tables
      {
        name: "Regular Tables",
        path: "tables/regular-tables",
        component: () => import("@/views/dashboard/tables/RegularTables"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      // Maps
      {
        name: "Google Maps",
        path: "maps/google-maps",
        component: () => import("@/views/dashboard/maps/GoogleMaps"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      },
      // Upgrade
      {
        name: "Upgrade",
        path: "upgrade",
        component: () => import("@/views/dashboard/Upgrade"),
        meta: { requiresAuth: true, roles: ["Modulator"] }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/Index")
  },
  {
    path: "/notfound",
    name: "notfound",
    component: () => import("@/views/notfound/Index")
  }
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let isLogined = false;
    try {
      isLogined = await authUsersMe();
    } catch (error) {
      isLogined = false;
    }

    if (!isLogined) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      const user = store.get("auth/me");
      if (to.meta.roles.includes(user.role.name)) {
        next();
      } else {
        if (["/", "/dashboard"].includes(to.fullPath)) {
          next({
            path: "/transaction/instant"
          });
          return;
        }
        next({
          path: "/notfound"
        });
      }
    }
  } else {
    if (to.name !== "notfound" && localStorage.getItem("jwt")) {
      next({
        path: "/"
      });
      return;
    }
    next(); // make sure to always call next()!
  }
});

export default router;
