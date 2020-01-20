<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners" :style="svgStyle">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'inherit'
    },
    size: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    svgStyle () {
      let styles = {}
      if (this.color) {
        styles.color = this.color
      }
      if (this.size) {
        styles.width = this.size
        styles.height = this.size
      }
      return styles
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
