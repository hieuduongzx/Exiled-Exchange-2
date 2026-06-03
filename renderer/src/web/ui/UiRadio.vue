<template>
  <button @click="updateInput" :class="$style['radio']">
    <template v-if="!useBgSelection">
      <div :class="[$style.circle, { [$style.checked]: isChecked }]">
        <div v-if="isChecked" :class="$style.dot"></div>
      </div>
      <slot />
    </template>
    <template v-else>
      <div
        class="rounded px-1 py-0.5"
        :class="{
          'bg-gray-700': isChecked,
        }"
      >
        <slot />
      </div>
    </template>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "UiRadio",
  emits: ["update:modelValue"],
  props: {
    value: {
      type: null,
      required: true,
    },
    modelValue: {
      type: null,
      required: true,
    },
    useBgSelection: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    return {
      isChecked: computed(() => {
        return props.modelValue === props.value;
      }),
      updateInput() {
        ctx.emit("update:modelValue", props.value);
      },
    };
  },
});
</script>

<style lang="postcss" module>
.radio {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-align: left;
  cursor: pointer;
  user-select: none;
}
.circle {
  width: 1rem;
  height: 1rem;
  border: 1.5px solid #6b7280;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.circle.checked {
  border-color: #0d9488;
}
.dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #0d9488;
  border-radius: 9999px;
}
</style>
