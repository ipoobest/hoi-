<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("member2") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("member_details") }}
            </div>
          </template>

          <div class="pt-2">
            <v-card class="my-0" style="height: 50%;">
              <v-card-title class="subheading font-weight-bold">
                <v-icon left color="warning">
                  mdi-account-edit
                </v-icon>
                {{ $t("edit_member") }}</v-card-title
              >
              <v-divider></v-divider>
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="12" class="pl-10 pt-5">
                  <a href="#" @click="$router.back()">{{ $t("back") }}</a>
                </v-col>
                <v-col cols="12" md="6">
                  <validation-observer ref="observer">
                    <v-container class="py-0">
                      <v-text-field
                        v-model="userDetail.username"
                        :label="$t('username')"
                        disabled
                      >
                        <v-icon slot="prepend">perm_identity</v-icon>
                      </v-text-field>
                      <v-text-field
                        v-model="userDetail.phone"
                        :label="$t('phone')"
                        disabled
                      >
                        <v-icon slot="prepend">phone</v-icon>
                      </v-text-field>
                      <PhoneVerifiedDropdown
                        v-model="userDetail.phoneVerified"
                        :label="$t('verify_phone')"
                        icon="phone"
                        disabled
                      />

                      <v-text-field
                        :value="userDetail.parentUsername || $t('not_have')"
                        :label="$t('parent_member')"
                        disabled
                      >
                        <v-icon slot="prepend">mdi-account-switch</v-icon>
                      </v-text-field>

                      <v-select
                        v-model="userType"
                        :items="userTypeItems"
                        :label="$t('type')"
                      >
                        <v-icon slot="prepend">mdi-account-convert</v-icon>
                      </v-select>

                      <v-text-field
                        :value="
                          $Moment(userDetail.createdAt).format('L HH:mm:ss')
                        "
                        :label="$t('created_at')"
                        disabled
                      >
                        <v-icon slot="prepend">mdi-account-plus</v-icon>
                      </v-text-field>

                      <v-text-field
                        :value="
                          $Moment(userDetail.lastLoginedAt).format('L HH:mm:ss')
                        "
                        :label="$t('last_logedin_date')"
                        disabled
                      >
                        <v-icon slot="prepend">mdi-account-key</v-icon>
                      </v-text-field>

                      <v-text-field
                        :value="$Numeral(userDetail.balance).format('0,0.00')"
                        :label="$t('balance2')"
                        disabled
                      >
                        <v-icon slot="prepend">money</v-icon>
                      </v-text-field>

                      <v-text-field
                        :value="
                          $Numeral(userDetail.affiliateBalance).format('0,0.00')
                        "
                        :label="$t('affiliate_balace')"
                        disabled
                      >
                        <v-icon slot="prepend">mdi-diamond</v-icon>
                      </v-text-field>

                      <v-switch
                        v-model="userBlocked"
                        :label="`${$t('block')}: ${
                          userBlocked ? $t('open') : $t('close')
                        }`"
                      >
                        <v-icon slot="prepend">mdi-block-helper</v-icon>
                      </v-switch>

                      <v-row>
                        <v-col class="pb-0">
                          <v-btn
                            type="submit"
                            color="success"
                            block
                            :disabled="
                              !['Modulator', 'Partner'].includes(me.role.name)
                            "
                            @click="onSubmitClicked"
                          >
                            ><v-icon left>playlist_add_check</v-icon
                            ><strong>{{ $t("save") }}</strong></v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </validation-observer>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { getUserById, updateUserById } from "@/api/user.js";
import PhoneVerifiedDropdown from "@/components/PhoneVerifiedDropdown";

export default {
  components: {
    PhoneVerifiedDropdown
  },
  data: () => ({
    userType: "DEBIT",
    userTypeItems: [],
    userBlocked: false,
    userDetail: {}
  }),
  computed: {
    me: get("auth/me")
  },
  watch: {
    "$route.params.id": {
      handler(id) {
        if (id) {
          getUserById(id)
            .then(res => {
              this.userDetail = res;
              this.userType = res.type;
              this.userBlocked = res.blocked;
            })
            .catch(err => err);
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.onLocaleChanged();
    this.$EventBus.$on("onLocaleChanged", this.onLocaleChanged);
  },
  beforeDestroy() {
    this.$EventBus.$off("onLocaleChanged", this.onLocaleChanged);
  },
  methods: {
    onLocaleChanged() {
      this.userTypeItems = [
        { text: this.$t("debit"), value: "DEBIT" },
        { text: this.$t("credit"), value: "CREDIT" }
      ];
    },
    async onSubmitClicked() {
      if (!["Modulator", "Partner"].includes(this.me.role.name)) {
        return;
      }
      let req = {
        type: this.userType,
        blocked: this.userBlocked
      };

      try {
        await updateUserById(this.userDetail.id, req);

        this.$Toastr.success(this.$t("edit_member_success"));
        this.$router.push({ path: "/member/player" });
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("edit_member_error"),
          "error"
        );
      }
    }
  }
};
</script>
