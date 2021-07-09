<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td>{{ item.name }}</td>
          <td style="text-align: right;">
            {{ $Numeral(item.price).format("0,0.00") }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
</script>
