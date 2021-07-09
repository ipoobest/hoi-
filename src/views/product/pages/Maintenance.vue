<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              {{ $t("products-maintenance") }}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{ $t("products_maintenance_subtitle") }}
            </div>
          </template>

          <div class="pt-2">
            <v-card class="my-0" style="height: 50%">
              <v-card-title class="subheading font-weight-bold">
                <v-icon left color="success"> mdi-plus-circle </v-icon>
                {{ $t("all_product") }}</v-card-title
              >
              <v-divider></v-divider>
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="6">
                  <validation-observer ref="observer">
                    <v-container class="py-0">
                      <v-expansion-panels v-model="panel">
                        <v-expansion-panel
                          v-for="type in Object.keys(groups)"
                          :key="type"
                        >
                          <v-expansion-panel-header
                            ><strong>{{
                              $t(getProductTypeByKey(type))
                            }}</strong></v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <v-row
                              v-for="(item, index) in groups[type].items"
                              :key="index"
                            >
                              <v-col class="mt-2">{{
                                item[getLangNameKeyFromLocale(locale)]
                              }}</v-col>
                              <v-col class="mt-0">
                                <v-switch
                                  v-model="status[item._id.toString()]"
                                  class="mt-0"
                                  :label="`${$t('status')} ${
                                    status[item._id.toString()]
                                      ? $t('open')
                                      : $t('close')
                                  }`"
                                  hide-details
                                ></v-switch>
                              </v-col>
                              <v-col v-if="item.type === 'STOCK'">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ attrs, on }">
                                    <v-text-field
                                      v-model="inputsGroup[item._id.toString()]"
                                      style="margin-top: -10px"
                                      :label="$t('group')"
                                      maxlength="10"
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <span>{{ $t("group_tooltips") }}</span>
                                </v-tooltip>
                              </v-col>
                              <v-col v-if="type != 'ARENA'">
                                <v-menu
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <div
                                      class="my-color-picker"
                                      :style="`background: ${
                                        colors[item._id.toString()]
                                      };`"
                                      v-bind="attrs"
                                      v-on="on"
                                    ></div>
                                  </template>
                                  <v-color-picker
                                    v-model="colors[item._id.toString()]"
                                    show-swatches
                                    dot-size="25"
                                    swatches-max-height="200"
                                  ></v-color-picker>
                                </v-menu>
                              </v-col>
                              <v-col v-if="type != 'ARENA'">
                                <v-btn
                                  class="ma-2 my-order-btn"
                                  x-small
                                  outlined
                                  fab
                                  color="green"
                                  @click="onUp(type, index)"
                                >
                                  <v-icon>arrow_upward</v-icon>
                                </v-btn>
                                <v-btn
                                  class="ma-2 my-order-btn"
                                  x-small
                                  outlined
                                  fab
                                  color="red"
                                  @click="onDown(type, index)"
                                >
                                  <v-icon>arrow_downward</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <v-divider class="mt-2" />

                      <v-row>
                        <v-col class="pb-0">
                          <v-btn
                            type="submit"
                            color="success"
                            block
                            @click="onSubmitClicked"
                            ><v-icon left>save</v-icon
                            ><strong>{{ $t("save") }}</strong></v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </validation-observer>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { get } from "vuex-pathify";
import { getProducts, updateProductLottoActiveById } from "@/api/productLotto";
import { getProductArenas, updateProductArenaActiveById } from "@/api/productArena";
import { getProductTypeByKey } from "@/utils/ProductTypeFormatter";
import { getLangNameKeyFromLocale } from "@/utils/LocaleUtil";

export default {
  data: () => ({
    getLangNameKeyFromLocale,
    getProductTypeByKey,
    items: [],
    status: {},
    groups: {},
    colors: {},
    inputsGroup: {},
    panel: 0
  }),
  computed: {
    locale: get("global/locale")
  },
  created() {
    this.initial();
  },
  methods: {
    async initial() {
      let items = [];
      let lottos = await getProducts(
        "?_sort=productName:ASC,order:ASC&status=OPEN"
      );
      items = items.concat(lottos);

      let arenas = await getProductArenas("?_sort=productName:ASC");
      items = items.concat(arenas);

      this.items = items;
      this.$_.forEach(items, o => {
        let type = o.type;
        if (type === "YEEKEE") {
          type = "LOTTO";
        } else if (type === "COIN" || type === "HILO" || type === "SPS") {
          type = "ARENA";
        }

        if (!this.groups[type]) {
          this.groups[type] = {
            items: []
          };
        }
        this.groups[type].items.push(o);
        this.status[o._id.toString()] = o.active;
        this.colors[o._id.toString()] = "#FFFFFF";
        if (o.color) {
          this.colors[o._id.toString()] = o.color;
        }
        this.inputsGroup[o._id.toString()] = o.group;
      });
      this.$forceUpdate();
    },
    async onSubmitClicked() {
      // merge data
      const lottos = {};
      const arenas = {};
      this.$_.forOwn(this.groups, (group, key) => {
        let index = 1;
        if (key === "ARENA") {
          this.$_.forEach(group.items, item => {
            arenas[item._id.toString()] = {
              active: this.status[item._id.toString()],
            };
          });
        } else {
          this.$_.forEach(group.items, item => {
            lottos[item._id.toString()] = {
              active: this.status[item._id.toString()],
              color: this.colors[item._id.toString()],
              group: this.inputsGroup[item._id.toString()],
              order: index++
            };
          });
        }
      });
      try {
        await updateProductLottoActiveById(lottos);
        await updateProductArenaActiveById(arenas);
        this.$Swal.fire(
          this.$t("info"),
          this.$t("edit_setting_success"),
          "success"
        );
      } catch (error) {
        this.$Swal.fire(
          this.$t("error3"),
          this.$t("edit_setting_error"),
          "error"
        );
      }
    },
    onUp(type, index) {
      if (index <= 0) {
        return;
      }
      const f = this.groups[type].items.splice(index, 1)[0];
      this.groups[type].items.splice(index - 1, 0, f);

      this.$forceUpdate();
    },
    onDown(type, index) {
      if (index >= this.groups[type].items.length - 1) {
        return;
      }
      const f = this.groups[type].items.splice(index, 1)[0];
      this.groups[type].items.splice(index + 1, 0, f);

      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.my-color-picker {
  border-radius: 3px;
  width: 30px;
  height: 30px;
  border: 1px solid rgb(207, 207, 207);
  margin-top: 8px;
  margin: 0 auto;
  cursor: pointer;
}
.my-order-btn {
  top: -8px;
}
</style>
