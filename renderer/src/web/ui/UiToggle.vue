<template>
  <button
    @click="updateInput"
    :class="$style['toggle']"
    :aria-pressed="modelValue"
  >
    <div :class="[$style.track, { [$style.on]: modelValue }]">
      <div :class="$style.thumb"></div>
    </div>
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UiToggle",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    return {
      updateInput() {
        ctx.emit("update:modelValue", !props.modelValue);
      },
    };
  },
});
</script>

<style lang="postcss" module>
.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}
.track {
  width: 2.25rem;
  height: 1.25rem;
  background-color: #374151;
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}
.track.on {
  background-color: #0d9488;
}
.thumb {
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 9999px;
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  transition: transform 0.2s ease;
}
.track.on .thumb {
  transform: translateX(1rem);
}
</style>
