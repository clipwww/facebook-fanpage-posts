import Vue from 'vue/dist/vue.common';
import axios from 'axios';

const domId = 'fb-widgets';

new Vue({
  el: `#${domId}`,
  data() {
    return {
      fanPage: null,
      action: document.getElementById(domId)?.getAttribute('action') ?? `https://clipwww-nuxt-express-project.herokuapp.com/api/fb/uniustyle`
    }
  },
  computed: {
    posts() {
      return this.fanPage?.posts?.filter((item, index) => index < 4) ?? [];
    }
  },
  created() {
    this.getFanPagePosts();
  },
  methods: {
    async getFanPagePosts() {
      try {
        const { data: ret } = await axios.get(this.action);
        if (!ret.success) {
          return;
        }
        
        this.fanPage = ret.item;

      } catch (err) { console.log(err) }
    },
    toPureHtmlString(htmlString: string) {
      return htmlString
        .replace(/<[^>]*>?/gm, '')
        .trim();
    },
    toSafeHtmlString(item: any) {
      return item.content?.replace(/(javascript\s*:)/g, 'javascripts：')
      .replace(/(@import)/g, 'import')
      .replace(/<\/?(script|meta|link|frame|iframe|style).*>/g, str =>
        str
          .replace(/</g, '&lt')
          .replace(/>/g, '&gt')
          .replace(/"/g, '&quot;')
      )
      .replace(
        /(ondblclick|onclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onload|onunload|onerror)=[^<]*(?=\>)/g,
        str => `__${str}`
      )
      .replace(/\n/g, '<br/>') ?? '';
    }
  },
})