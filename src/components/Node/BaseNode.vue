<template>
  <div
    class="node"
    :class="{ selected: isSelected }"
    :style="{ borderColor: color, color }"
    @click="selectNode"
  >
    <slot></slot>
    <ConnectorPoint :color="color" />
  </div>
</template>

<script>
import ConnectorPoint from "./ConnectorPoint.vue";

export default {
  name: "BaseNode",
  components: { ConnectorPoint },
  props: {
    color: {
      type: String,
      default: "white",
    },
    hoverColor: {
      type: String,
      default: "transparent",
    },
  },
  data() {
    return {
      isSelected: false,
    };
  },
  methods: {
    selectNode() {
      this.isSelected = true;
    },
  },
};
</script>

<style scoped>
.node {
  position: relative;
  min-width: 10rem;
  max-width: 15rem;
  min-height: 10rem;
  padding: 1.2rem;
  box-sizing: border-box;

  border: 2.5px solid;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;

  transition: box-shadow 0.25s;
}

.node.selected {
  box-shadow: 0 0 8px 0 rgba(255, 255, 255, 0.5);
}

.node * {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
</style>
