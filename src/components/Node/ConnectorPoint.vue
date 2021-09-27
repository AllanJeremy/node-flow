<template>
  <div
    :class="`connector-point ${position}`"
    :style="{ backgroundColor: color, ...connectorStyle }"
  ></div>
</template>

<script>
export default {
  name: "ConnectorPoint",
  props: {
    position: {
      type: String,
      default: "right",
    },
    top: {
      type: String,
      default: null,
    },
    bottom: {
      type: String,
      default: "calc(50% - 0.5rem)", //? Using this to center by default since top is usually checked for first when determining style. We want top to be able to override this.
    },
    color: {
      type: String,
      default: "white",
    },
  },
  computed: {
    connectorStyle() {
      let style = {};

      if (this.top) {
        style = { top: this.top };
      } else if (this.bottom) {
        style = { bottom: this.bottom };
      }

      return style;
    },
  },
};
</script>

<style scoped>
.connector-point {
  position: absolute;
  height: 1rem;
  width: 1rem;
  border-radius: 100%;
  background-color: crimson;
}

.connector-point.left {
  left: -0.5rem;
}

.right {
  right: 0;
  margin-right: -0.5rem;
}
</style>
