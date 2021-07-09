<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td>{{ item.name }}</td>
          <td style="text-align: right;">{{ item.price }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    start: {
      type: Number,
      default: 100
    },
    end: {
      type: Number,
      default: 100000
    },
    nagative: {
      type: Boolean
    }
  },
  data() {
    return {
      items: []
    };
  },
  created() {
    let sort = "desc";
    if (this.nagative) {
      sort = "asc";
      this.start *= -1;
      this.end *= -1;
    }
    for (let i = 0; i < 10; i++) {
      const randomPrice =
        Math.floor(Math.random() * (this.end - this.start)) + this.start / 10;
      this.items.push({
        name: this.makeid(8),
        rawPrice: randomPrice,
        price: this.$Numeral(randomPrice).format("0,0.00")
      });
    }
    this.items = this.$_.orderBy(this.items, ["rawPrice"], [sort]);
  },
  methods: {
    makeid(length) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
  }
};
</script>
