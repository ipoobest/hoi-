<template>
  <v-data-iterator :items="[item]" hide-default-footer>
    <template v-slot:default="props">
      <v-row>
        <v-col v-for="obj in props.items" :key="obj.key" class="py-0">
          <v-card class="my-0">
            <v-card-title class="subheading font-weight-bold">
              <v-icon left color="success">
                {{ item.icon }}
              </v-icon>
              {{ $t(item.name) }}
            </v-card-title>
            <v-divider></v-divider>

            <v-list dense>
              <template v-for="data in obj.data">
                <v-list-item
                  v-if="data.active === undefined || data.active"
                  :key="data.key"
                >
                  <v-list-item-content>
                    <strong>{{ $t(data.topic) }} </strong>
                  </v-list-item-content>
                  <v-list-item-content
                    v-if="data.key === 'role'"
                    class="align-end"
                  >
                    <template v-if="data && data.value && data.value.name">
                      <span>{{
                        $t(data.value.name.toLowerCase().split(" ").join("_"))
                      }}</span>
                    </template>
                  </v-list-item-content>
                  <v-list-item-content v-else class="align-end">
                    {{ data.value }}
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-list-item>
                <v-list-item-content>
                  <strong>{{ $t("block") }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-select
                    v-model="userBlocked"
                    :items="blockItems"
                    :label="$t('block')"
                  >
                  </v-select>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="
                  ['Modulator', 'Partner', 'Super Admin'].includes(me.role.name)
                "
              >
                <v-list-item-content>
                  <strong>{{ $t("password") }}</strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-text-field
                    v-model="newPassword"
                    :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showNewPassword ? 'text' : 'password'"
                    :label="$t('password')"
                    autocomplete="new-password"
                    counter
                    @click:append="showNewPassword = !showNewPassword"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <strong></strong>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-btn
                    color="success"
                    :loading="loading"
                    @click="onUpdateUser"
                  >
                    ><v-icon left>playlist_add_check</v-icon
                    ><strong>{{ $t("save") }}</strong></v-btn
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { updateUserById, userForceChangePassword } from "@/api/user.js";
import { get } from "vuex-pathify";
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    loading: false,
    userType: null,
    userTypeItems: [],
    userBlocked: null,
    blockItems: [],
    phoneVerified: false,
    phoneVerifiedItems: [],
    showNewPassword: false,
    newPassword: null
  }),
  computed: {
    locale: get("global/locale"),
    me: get("auth/me")
  },
  watch: {
    user(value) {
      this.userType = value.type;
      this.userBlocked = value.blocked;
      this.phoneVerified = value.phoneVerified;
    },
    locale(value) {
      this.onLocaleChanged();
    }
  },
  created() {
    this.userType = this.user.type;
    this.userBlocked = this.user.blocked;
    this.phoneVerified = this.user.phoneVerified;
    this.onLocaleChanged();
  },
  methods: {
    resetForm() {
      this.newPassword = null;
    },
    onLocaleChanged() {
      this.userTypeItems = [
        { text: this.$t("debit"), value: "DEBIT" },
        { text: this.$t("credit"), value: "CREDIT" }
      ];
      this.blockItems = [
        { text: this.$t("open"), value: true },
        { text: this.$t("close"), value: false }
      ];
      this.phoneVerifiedItems = [
        { text: this.$t("waiting_verify"), value: false },
        { text: this.$t("verified"), value: true }
      ];
    },
    async onUpdateUser() {
      let req = {
        type: this.userType,
        blocked: this.userBlocked,
        phoneVerified: this.phoneVerified
      };
      this.loading = true;

      try {
        await updateUserById(this.user._id, req);
        if (this.newPassword) {
          await userForceChangePassword({
            userId: this.user._id,
            newPassword: this.newPassword
          });
        }
        this.$Toastr.success(this.$t("edit_member_success"));
        this.resetForm();
        this.loading = false;
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("edit_member_error"),
          "error"
        );
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>
