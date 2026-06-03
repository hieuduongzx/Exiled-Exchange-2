<template>
  <button @click="updateInput" :class="$style['checkbox']">
    <div :class="[$style.box, { [$style.checked]: modelValue === values[0] }]">
      <svg v-if="modelValue === values[0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UiCheckbox",
  emits: ["update:modelValue"],
  props: {
    modelValue: {},
    values: {
      type: Array,
      default: [true, false],
    },
  },
  setup(props, ctx) {
    return {
      updateInput() {
        const [on, off] = props.values;
        ctx.emit("update:modelValue", props.modelValue === on ? off : on);
      },
    };
  },
});
</script>

<style lang="postcss" module>
.checkbox {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-align: left;
  cursor: pointer;
  user-select: none;
}
.box {
  width: 1rem;
  height: 1rem;
  border: 1.5px solid #6b7280;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.box.checked {
  background-color: #0d9488;
  border-color: #0d9488;
  color: white;
}
.box svg {
  width: 0.75rem;
  height: 0.75rem;
}
</style>
