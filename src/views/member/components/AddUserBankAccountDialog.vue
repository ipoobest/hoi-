<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="green">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t("add_user_bank_account") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text :loading="loading" @click="onSave">
            {{ $t("save") }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-row>
              <v-col class="pt-0">
                <validation-observer ref="observer">
                  <v-form>
                    <BankDropdownWithValidation
                      v-model="bank"
                      :name="$t('bank_name')"
                      :label="$t('bank_name')"
                      rules="required"
                    />
                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t('full-name')"
                      rules="required|max:50"
                    >
                      <v-text-field
                        v-model="name"
                        :label="$t('full-name')"
                        :error-messages="errors"
                      >
                        <v-icon slot="prepend">perm_contact_calendar</v-icon>
                      </v-text-field>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t('bank_account_no')"
                      rules="required"
                    >
                      <v-text-field
                        v-model="bankAccount"
                        v-mask="[
                          '###-#-#####-#',
                          '###-#-#####-##',
                          '###-#-#####-###',
                          '###-#-#####-####',
                          '###-#-#####-####-#'
                        ]"
                        type="text"
                        :label="$t('bank_account_no')"
                        :error-messages="errors"
                      >
                        <v-icon slot="prepend">credit_card</v-icon>
                      </v-text-field>
                    </validation-provider>
                  </v-form>
                </validation-observer>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import { mask } from "vue-the-mask";
import { withValidation } from "vee-validate";

import { addUserBankAccount } from "@/api/userBankAccount.js";

import BankDropdown from "@/components/BankDropdown";
const BankDropdownWithValidation = withValidation(BankDropdown);

export default {
  name: "AddUserBankAccountDialog",
  directives: {
    mask
  },
  components: {
    BankDropdownWithValidation
  },
  data: () => ({
    dialog: false,
    loading: false,
    bank: null,
    name: null,
    bankAccount: null
  }),
  methods: {
    openDialog(user) {
      this.user = user;
      this.dialog = true;
    },
    resetForm() {
      this.user = null;
      this.bank = null;
      this.bankAccount = null;
      this.name = null;
    },
    async onSave() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        try {
          this.loading = true;
          const bank = {
            userId: this.user._id.toString(),
            bankId: this.bank._id,
            accountCode: this.bankAccount.replace(/\-/g, ""),
            accountName: this.name,
            status: "WAITING"
          };
          await addUserBankAccount(bank);
          this.resetForm();
          this.loading = false;
          this.dialog = false;
          this.$EventBus.$emit("onMemberRefresh");
        } catch (err) {
          if (this.$_.get(err, "response.data.data.code") === 2013) {
            this.$Swal.fire(
              this.$t("error"),
              this.$t("cant.add.bank.account.already.exists"),
              "error"
            );
          } else if (this.$_.get(err, "response.data.data.code") === 2014) {
            this.$Swal.fire(
              this.$t("error"),
              this.$t("cant.add.bank.maximum.user.bank.accounts"),
              "error"
            );
          } else {
            this.$Swal.fire(
              this.$t("error"),
              this.$t("cant.add.account"),
              "error"
            );
          }
          this.loading = false;
        }
      }
    }
  }
};
</script>
