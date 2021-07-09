<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("admin-register") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("admin_register_subtitle") }}
            </div>
          </template>

          <v-col cols="12" md="12" class="pl-10 pt-5">
            <a href="#" @click="$router.back()">{{ $t("back") }}</a>
          </v-col>

          <v-container class="py-0 pb-5" style="width: 40vw; min-width: 500px;">
            <validation-observer ref="observer">
              <v-form ref="form" @submit.prevent="onSubmit">
                <AdminRoleSingleDropdownWithValidation
                  v-model="role"
                  :label="$t('role')"
                />
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('username')"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="username"
                    :name="$t('username')"
                    :label="$t('username')"
                    counter
                    :error-messages="errors"
                    ><v-icon slot="prepend">mdi-account</v-icon></v-text-field
                  >
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  vid="password"
                  :name="$t('password')"
                  rules="required|min:8"
                >
                  <v-text-field
                    v-model="password"
                    counter
                    type="password"
                    autocomplete="new-password"
                    :error-messages="errors"
                    :label="$t('password')"
                    ><v-icon slot="prepend"
                      >mdi-lock-question</v-icon
                    ></v-text-field
                  >
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('confirm_password')"
                  rules="required|confirmed:password"
                >
                  <v-text-field
                    v-model="confirmPassword"
                    counter
                    type="password"
                    autocomplete="new-password"
                    :error-messages="errors"
                    :label="$t('confirm_password')"
                    ><v-icon slot="prepend"
                      >mdi-lock-question</v-icon
                    ></v-text-field
                  >
                </validation-provider>
                <!-- <validation-provider
                  v-slot="{ errors }"
                  :name="$t('email')"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :name="$t('email')"
                    :label="$t('email')"
                    counter
                    :error-messages="errors"
                    ><v-icon slot="prepend">mdi-email</v-icon></v-text-field
                  >
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('phone')"
                  rules="required"
                >
                  <v-text-field
                    v-model="mobilephone"
                    type="tel"
                    name="mobilephone"
                    counter
                    :error-messages="errors"
                    :label="$t('phone')"
                    ><v-icon slot="prepend">mdi-phone</v-icon></v-text-field
                  >
                </validation-provider> -->
                <br />
                <br />
                <v-btn
                  class="mr-4"
                  type="submit"
                  color="success"
                  :loading="processing"
                  >{{ $t("register2") }}</v-btn
                >
                <v-btn color="gray" :loading="processing" @click="onReset">{{
                  $t("reset")
                }}</v-btn>
              </v-form>
            </validation-observer>
          </v-container>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/api/axios.js";
import { withValidation } from "vee-validate";

import AdminRoleSingleDropdown from "@/components/AdminRoleSingleDropdown";
const AdminRoleSingleDropdownWithValidation = withValidation(
  AdminRoleSingleDropdown
);

export default {
  name: "AdminRegister",
  components: {
    AdminRoleSingleDropdownWithValidation
  },
  data: () => ({
    processing: false,

    username: null,
    // email: null,
    // mobilephone: null,
    password: null,
    confirmPassword: null
  }),
  methods: {
    onReset() {
      this.$refs.form.reset();
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
    async onSubmit() {
      const validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      this.processing = true;
      axios
        .get("/custom/users/roles/" + this.role)
        .then(async res => {
          this.processing = false;
          try {
            const response = await axios.post("/auth/local/register", {
              username: this.username,
              email: this.username + "@" + this.username + ".com",
              password: this.confirmPassword,
              phone: this.username,
              customRoleId: res.data.id
            });

            this.processing = false;
            this.onReset();
            this.$Swal.fire(
              this.$t("info"),
              this.$t("register_success"),
              "success"
            );
          } catch (error) {
            this.processing = false;
            this.$Swal.fire(
              this.$t("error3"),
              this.$t("register_error"),
              "error"
            );
          }
        })
        .catch(error => {
          this.processing = false;
          this.$Swal.fire(
            this.$t("error3"),
            this.$t("register_error"),
            "error"
          );
        });
    }
  }
};
</script>
