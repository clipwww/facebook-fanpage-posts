import Vue from 'vue/dist/vue.common';
import VueCompositionApi, { reactive, toRefs, computed } from '@vue/composition-api';

Vue.use(VueCompositionApi);
import axios from 'axios';

const domId = 'fb-widgets';

new Vue({
  el: `#${domId}`,
  setup() {
    const state = reactive({
      fanPage: null,
      action: document.getElementById(domId)?.getAttribute('action') ?? `https://clipwww-nuxt-express-project.herokuapp.com/api/fb/uniustyle`
    });
    const posts = computed(() => state.fanPage?.posts?.filter((_item, index) => index < 4) ?? [])

    async function getFanPagePosts() {
      try {
        const { data: ret } = await axios.get(state.action);
        if (!ret.success) {
          return;
        }

        state.fanPage = ret.item;

      } catch (err) { console.log(err) }
    }

    function toPureHtmlString(htmlString: string) {
      return htmlString
        .replace(/<[^>]*>?/gm, '')
        .trim();
    };

    getFanPagePosts();

    return {
      ...toRefs(state),
      posts,

      toPureHtmlString
    }
  }
})