<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="600px">
    <v-card>
      <v-card-title>{{ $t("add_limit_number") }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 300px">
        <validation-observer ref="observer">
          <v-form @submit.prevent="onSubmit">
            <validation-provider
              v-slot="{ errors }"
              :name="$t('type')"
              :vid="key"
              rules="required"
            >
              <v-select
                v-model="type"
                :items="typeItems"
                :label="$t('type')"
                :error-messages="errors"
              ></v-select>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              :name="$t('number')"
              :vid="key"
              :rules="{ required: true, numeric: true, length: length }"
            >
              <v-text-field
                v-model="number"
                :label="$t('number')"
                :error-messages="errors"
              />
            </validation-provider>
          </v-form>
        </validation-observer>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="gray darken-1" text @click="dialog = false">{{
          $t("cancel")
        }}</v-btn>
        <v-spacer />
        <v-btn color="green darken-1" text @click="onSaveClicked">{{
          $t("save")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { lottoTypes, getLottoLengthByKey } from "@/utils/LottoTypeFormatter";
import { addLottoLimitNumber } from "@/api/lottoLimitNumber.js";

export default {
  name: "LottoLimitNumberDialog",
  data: () => ({
    dialog: false,
    lottoId: null,
    length: 0,
    number: null,
    type: null,
    typeItems: []
  }),
  watch: {
    type(value) {
      if (value) {
        this.length = getLottoLengthByKey(value);
      }
    }
  },
  created() {
    this.$_.forOwn(lottoTypes, (value, key) => {
      this.typeItems.push({
        text: value,
        value: key
      });
    });
  },
  methods: {
    open(lottoId) {
      if (!lottoId) {
        return;
      }
      this.reset();

      this.lottoId = lottoId;
      this.dialog = true;
    },
    reset() {
      this.number = null;
      this.type = null;
      this.length = 0;
      if (this.$refs.observer) {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      }
    },
    async onSaveClicked() {
      let validate = await this.$refs.observer.validate();
      if (!validate) {
        return;
      }

      try {
        await addLottoLimitNumber({
          lottoId: this.lottoId,
          type: this.type,
          number: this.number
        });
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("add_limit_number_error"),
          "error"
        );
        return;
      }

      this.dialog = false;
      this.$emit("after-saved", {
        type: this.type,
        number: this.number
      });
    }
  }
};
</script>
