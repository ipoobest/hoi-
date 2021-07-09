import Vue from "vue";
import Vuex from "vuex";
import pathify, { make } from "vuex-pathify";

Vue.use(Vuex);
pathify.options.deep = 2;

const debug = process.env.NODE_ENV !== "production";

const authentication = () => {
  const state = {
    me: {}
  };
  const mutations = make.mutations(state);
  const actions = make.actions(state);
  const getters = make.getters(state);
  return { namespaced: true, state, mutations, actions, getters };
};

const global = () => {
  const state = {
    barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
    barImage:
      "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg",
    drawer: true,
    locale: "en",
    overallFilterDate: null,
    soundOn: true
  };
  const mutations = make.mutations(state);
  const actions = make.actions(state);
  const getters = make.getters(state);
  return { namespaced: true, state, mutations, actions, getters };
};

/* Bind the Vuex functionality to the Vue.js instance */
const store = new Vuex.Store({
  plugins: [pathify.plugin],
  modules: {
    auth: authentication(),
    global: global()
  },
  strict: debug
});

export default store;
