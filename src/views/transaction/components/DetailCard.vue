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
              <div v-for="data in obj.data" :key="data.key">
                <v-list-item v-if="data.active === undefined || data.active">
                  <v-list-item-content>
                    <strong>{{ $t(data.topic) }} </strong>
                  </v-list-item-content>

                  <v-list-item-content
                    v-if="data.key === 'username'"
                    class="align-end"
                  >
                    <router-link
                      tag="a"
                      :to="`/member/${transaction.user._id}`"
                      >{{ data.value }}</router-link
                    >
                  </v-list-item-content>
                  <v-list-item-content
                    v-else-if="data.key === 'parentUsername'"
                    class="align-end"
                  >
                    <router-link
                      v-if="data.value"
                      tag="a"
                      :to="`/admin/${transaction.user.parentUserId}`"
                      >{{ data.value }}</router-link
                    >
                    <span v-else>-</span>
                  </v-list-item-content>
                  <v-list-item-content
                    v-else-if="data.key === 'adminUsername'"
                    class="align-end"
                  >
                    <router-link
                      tag="a"
                      :to="`/admin/${transaction.adminId}`"
                      >{{ data.value }}</router-link
                    >
                  </v-list-item-content>
                  <v-list-item-content v-else-if="data.key === 'type'">
                    <div>
                      <v-chip v-if="data.value === 'DEPOSIT'" color="success"
                        >ฝาก</v-chip
                      >
                      <v-chip
                        v-else-if="data.value === 'WITHDRAWAL'"
                        color="primary"
                        >ถอน</v-chip
                      >
                      <v-chip
                        v-else-if="data.value === 'ADJUSTMENT'"
                        color="warning"
                        >ปรับยอด</v-chip
                      >
                      <v-chip v-else>{{ data.value }}</v-chip>
                    </div>
                  </v-list-item-content>
                  <v-list-item-content v-else-if="data.key === 'status'">
                    <div>
                      <strong
                        v-if="data.value === 'APPROVED'"
                        class="green--text"
                      >
                        {{ getTransactionStatusByKey(data.value) }}
                      </strong>
                      <strong v-else class="primary--text">
                        {{ getTransactionStatusByKey(data.value) }}
                      </strong>
                    </div>
                  </v-list-item-content>
                  <v-list-item-content v-else-if="data.key === 'receipt'">
                    <template v-if="data.value !== '-'">
                      <a :href="receiptURL" target="_blank">{{
                        receiptName
                      }}</a>
                      <div style="position: absolute; left: 100vw;">
                        {{ getReceiptURL(data.value) }}
                      </div>
                    </template>
                    <template v-else>{{ data.value }}</template>
                  </v-list-item-content>
                  <v-list-item-content
                    v-else-if="data.key === 'userBankAccount.bank'"
                  >
                    <template v-if="data.value">
                      <div>
                        {{ data.value.bank[getLangNameKeyFromLocale(locale)] }}
                      </div>
                    </template>
                    <template v-else>-</template>
                  </v-list-item-content>
                  <v-list-item-content v-else-if="data.key === 'terminal'">
                    <template v-if="data.value">
                      <div>
                        {{ $t(data.value) }}
                      </div>
                    </template>
                    <template v-else>-</template>
                  </v-list-item-content>
                  <v-list-item-content
                    v-else-if="data.key === 'companyBankName'"
                  >
                    <template v-if="data.value">
                      <div>
                        {{ data.value.bank[getLangNameKeyFromLocale(locale)] }}
                      </div>
                    </template>
                    <template v-else>-</template>
                  </v-list-item-content>

                  <v-list-item-content v-else class="align-end">
                    {{ data.value }}
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { get } from "vuex-pathify";
import { getFile } from "@/api/upload";
import { getTransactionStatusByKey } from "@/utils/TransactionStatusFormatter.js";

import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";
export default {
  props: {
    transaction: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    getLangNameKeyFromLocale,
    receiptName: "",
    receiptURL: "#"
  }),
  computed: {
    locale: get("global/locale")
  },
  methods: {
    getTransactionStatusByKey,
    async getReceiptURL(id) {
      const file = await getFile(id);
      this.receiptName = file.name;
      this.receiptURL = process.env.VUE_APP_BASEURL + file.url;
    }
  }
};
</script>

<style></style>
