<template>
  <button
    :class="[
      $style.btn,
      { [$style.active]: active != null ? active : !filter.disabled },
    ]"
    @click="toggle"
  >
    <img v-if="img" :src="img" class="w-5 h-5" />
    <span class="pl-1">{{ t(text) }}</span>
    <i
      v-if="collapse"
      class="pl-2 text-xs text-gray-400"
      :class="filter.disabled ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"
    />
  </button>
</template>

<script setup lang="ts">
import { type PropType } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  filter: {
    type: Object as PropType<{ disabled: boolean }>, // will be mutated directly, instead of emit
    required: true,
  },
  text: { type: String, required: true },
  img: { type: String, default: undefined },
  readonly: { type: Boolean, default: undefined },
  active: { type: Boolean, default: undefined },
  collapse: { type: Boolean, default: undefined },
});

const { t } = useI18n();

function toggle() {
  const { filter, readonly } = props;
  if (!readonly) {
    filter.disabled = !filter.disabled;
  }
}
</script>

<style lang="postcss" module>
.btn {
  background: var(--surface-1);
  @apply rounded;
  border: 1px solid var(--glass-border);
  @apply pl-1 pr-2;
  line-height: 1.25rem;
  display: flex;
  align-items: center;
  transition: all 0.15s ease;

  &:hover {
    background: var(--surface-2);
    border-color: var(--glass-border-hover);
  }

  &.active {
    background: var(--accent-soft);
    border-color: var(--accent-ring);
    color: var(--accent-hover);
  }
}
</style>
