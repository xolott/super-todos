import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
// import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
});

export default vuetify;
