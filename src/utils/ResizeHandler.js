import store from '@/store'

const {body} = document
const WIDTH = 991

export default {
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', {withoutAnimation: true})
    }
    this.$_compuedLayoutWidth(isMobile)
  },
  methods: {
    $_compuedLayoutWidth(isMobile) {
      const pageEle = document.getElementById('page')
      let pageWidth = (pageEle.clientWidth || pageEle.offsetWidth || 0)
      if (isMobile) {
        store.dispatch('app/setLayoutWidth', pageWidth - 20)
      } else {
        store.dispatch('app/setLayoutWidth', pageWidth - 240)
      }
    },
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', {withoutAnimation: true})
        } else {
          store.dispatch('app/openSideBar')
        }
        this.$_compuedLayoutWidth(isMobile)
      }
    }
  }
}
