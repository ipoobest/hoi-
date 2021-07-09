<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr>
          <th>{{ $t("product_name") }}</th>
          <th style="text-align: right">{{ $t("bet_amount") }}</th>
          <th style="text-align: right">Affiliate</th>
          <th style="text-align: right">{{ $t("net_amount") }}</th>
          <th style="text-align: right">{{ $t("prize") }}</th>
          <th style="text-align: right">{{ $t("profit") }}</th>
        </tr>
        <tr v-for="item in items" :key="item.name">
          <td>
            {{
              item[`productLotto${getLangNameKeyFromLocaleUpperCase(locale)}`]
            }}
          </td>
          <td style="text-align: right">
            {{ $Numeral(item.totalAmount).format("0,0.00") }}
          </td>
          <td style="text-align: right">
            {{ $Numeral(item.totalAffiliate).format("0,0.00") }}
          </td>
          <td style="text-align: right">
            {{ $Numeral(item.totalNet).format("0,0.00") }}
          </td>
          <td style="text-align: right">
            {{ $Numeral(item.totalReward).format("0,0.00") }}
          </td>
          <td style="text-align: right">
            {{ $Numeral(item.totalProfit).format("0,0.00") }}
          </td>
        </tr>
        <tr v-if="summaryRow">
          <td></td>
          <td class="font-weight-black" style="text-align: right">
            {{ $Numeral(summaryRow.totalAmount).format("0,0.00") }}
          </td>
          <td class="font-weight-black" style="text-align: right">
            {{ $Numeral(summaryRow.totalAffiliate).format("0,0.00") }}
          </td>
          <td class="font-weight-black" style="text-align: right">
            {{ $Numeral(summaryRow.totalNet).format("0,0.00") }}
          </td>
          <td class="font-weight-black" style="text-align: right">
            {{ $Numeral(summaryRow.totalReward).format("0,0.00") }}
          </td>
          <td class="font-weight-black" style="text-align: right">
            {{ $Numeral(summaryRow.totalProfit).format("0,0.00") }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { get } from "vuex-pathify";
import { getLangNameKeyFromLocaleUpperCase } from "@/utils/LocaleUtil";
Object.freeze(getLangNameKeyFromLocaleUpperCase);

export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    getLangNameKeyFromLocaleUpperCase
  }),
  computed: {
    locale: get("global/locale"),
    summaryRow: function () {
      let summaryRow = {
        productLottoId: "",
        productLottoName: "",
        productLottoThaiName: "",
        firstResultedAt: "",
        lastResultedAt: "",
        totalAmount: 0,
        totalAffiliate: 0,
        totalNet: 0,
        totalReward: 0,
        totalProfit: 0
      };
      for (let i of this.items) {
        summaryRow.totalAmount += i.totalAmount;
        summaryRow.totalAffiliate += i.totalAffiliate;
        summaryRow.totalNet += i.totalNet;
        summaryRow.totalReward += i.totalReward;
        summaryRow.totalProfit += i.totalProfit;
      }
      return summaryRow;
    }
  }
};
</script>
