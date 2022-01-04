import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
  },
});

export default vuetify;
