<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("administrator") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("administrator_details") }}
            </div>
          </template>

          <div class="pt-2">
            <v-card class="my-0" style="height: 50%;">
              <v-card-title class="subheading font-weight-bold">
                <v-icon left color="warning">
                  mdi-account-edit
                </v-icon>
                {{ $t("edit_administrator") }}</v-card-title
              >
              <v-divider></v-divider>
              <v-row class="d-flex justify-center">
                <v-col cols="12" sm="12" class="pt-5 pl-10">
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

                      <v-text-field
                        v-model="userDetail.email"
                        :label="$t('email')"
                        disabled
                      >
                        <v-icon slot="prepend">email</v-icon>
                      </v-text-field>

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
                              me.role.name === 'Partner' &&
                              userDetail.role.name !== 'Approver'
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

export default {
  data: () => ({
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
              this.userBlocked = res.blocked;
            })
            .catch(err => err);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async onSubmitClicked() {
      if (
        this.me.role.name === "Partner" &&
        this.userDetail.role.name !== "Approver"
      ) {
        return;
      }
      let req = {
        blocked: this.userBlocked
      };

      try {
        await updateUserById(this.userDetail.id, req);

        this.$Toastr.success(this.$t("edit_administrator_success"));
        this.$router.push({ path: "/admin/list" });
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("edit_administrator_error"),
          "error"
        );
      }
    }
  }
};
</script>
