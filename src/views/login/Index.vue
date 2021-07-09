<template>
  <v-app :class="customerNo === '12' ? 'custom-bg' : 'login-bg'">
    <v-container fill-height justify="center">
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <base-material-card>
            <template v-slot:heading>
              <div class="display-2 font-weight-light text-center">
                เข้าสู่ระบบ
              </div>

              <div class="subtitle-1 font-weight-light text-center">
                ระบุชื่อผู้ใช้และรหัสผ่าน
              </div>
            </template>

            <v-form class="pa-2 pb-0" @submit.prevent="onLoginClicked">
              <v-text-field
                v-model="username"
                label="ชื่อผู้ใช้"
                data-vv-name="name"
              >
                <v-icon v-if="customerNo !== '12'" slot="prepend">
                  perm_identity
                </v-icon>
              </v-text-field>
              <v-text-field
                v-model="password"
                label="รหัสผ่าน"
                data-vv-name="password"
                type="password"
              >
                <v-icon v-if="customerNo !== '12'" slot="prepend">
                  lock_open
                </v-icon>
              </v-text-field>
              <v-row>
                <v-col>
                  <v-btn
                    type="submit"
                    :color="customerNo === '12' ? 'amber' : 'primary'"
                    block
                  >
                    <v-icon v-if="customerNo !== '12'" left>exit_to_app</v-icon>
                    <strong>เข้าสู่ระบบ</strong></v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </base-material-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { authLocalLogin } from "@/api/authentication.js";

export default {
  name: "Login",
  data: () => ({
    customerNo: process.env.VUE_APP_CUSTOMER_NO,
    username: "",
    password: ""
  }),
  methods: {
    onLoginClicked() {
      if (!this.username || !this.password) {
        this.$Swal.fire(
          "คำเตือน",
          "กรุณากรอกชื่อผู้ใช้ และ รหัสผ่าน!",
          "warning"
        );
        return;
      }

      authLocalLogin(this.username, this.password)
        .then(() => {
          this.$router.replace(this.$route.query.redirect || "/");
          this.$Toastr.success("เข้าสู่ระบบเรียบร้อยแล้ว");
        })
        .catch(() => {
          this.$Swal.fire(
            "ผิดพลาด",
            "ชื่อผู้ใช้ หรือ รหัสผ่านผิด กรุณาลองใหม่อีกครั้ง",
            "error"
          );
        });
    }
  }
};
</script>

<style lang="scss">
.login-bg {
  background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      from(rgba(0, 0, 0, 0.5)),
      to(rgba(0, 0, 0, 0.5))
    ),
    url(../../assets/login.jpg) !important;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ),
    url(../../assets/login.jpg) !important;
  background-position: top center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
}
.custom-bg {
  background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      from(rgba(0, 0, 0, 0.5)),
      to(rgba(0, 0, 0, 0.5))
    ),
    url(../../assets/login-custom.jpg) !important;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ),
    url(../../assets/login-custom.jpg) !important;
  background-position: top center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
}

.v-card--material__heading {
  @if $customerno == 12 {
    display: none !important;
  }
}
</style>
