<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="item in items" :key="item.accountCode">
          <td>{{ item.accountName }}</td>
          <td>{{ bankAccountCodeFormatter.apply(item.accountCode) }}</td>
          <td style="text-align: right;">
            {{ $Numeral(item.balance).format("0,0.00") }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { bankAccountCodeFormatter } from "@/utils/StringMask.js";
export default {
  name: "CompanyBankAccountTable",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      bankAccountCodeFormatter
    };
  }
};
</script>
