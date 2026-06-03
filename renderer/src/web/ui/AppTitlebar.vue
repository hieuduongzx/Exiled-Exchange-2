<template>
  <div :class="$style.titlebar">
    <slot />
    <button @click="emit('click')" class="truncate">{{ title }}</button>
    <button
      @click.stop="emit('close')"
      tabindex="-1"
      :class="[$style.button, $style.close]"
      title="Close"
    >
      <i class="fas fa-window-close"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const emit = defineEmits<{
  (e: "click" | "close"): void;
}>();
</script>

<style lang="postcss" module>
.titlebar {
  background: rgba(10, 10, 12, 0.6);
  color: #9ca3af;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  line-height: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  button {
    @apply px-2 pt-px;
    transition: all 0.15s ease;

    &:hover {
      color: #e5e7eb;
      background: rgba(255, 255, 255, 0.06);
    }

    &.close:hover {
      color: #f87171;
      background: rgba(248, 113, 113, 0.15);
    }
  }
}
</style>
