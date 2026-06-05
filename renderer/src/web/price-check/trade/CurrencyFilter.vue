<template>
  <ui-popover
    :delay="[80, null]"
    placement="bottom-start"
    boundary="#price-window"
  >
    <template #target>
      <button
        class="rounded mr-1 px-2 truncate"
        :class="showWarning() ? 'text-orange-500' : 'text-gray-500'"
      >
        <span
          ><i class="fas fa-coins"></i>
          {{ displayCurrency }}</span
        >
      </button>
    </template>
    <template #content>
      <div class="flex flex-col gap-y-1 p-2 bg-gray-800 text-gray-400">
        <ui-radio
          v-model="filters.trade.currency"
          :value="undefined"
          >{{ t(":currency_any") }}</ui-radio
        >
        <ui-radio v-model="filters.trade.currency" value="exalted">{{
          t(":currency_only_exalted")
        }}</ui-radio>
        <ui-radio v-model="filters.trade.currency" value="chaos">{{
          t(":currency_only_chaos")
        }}</ui-radio>
        <ui-radio v-model="filters.trade.currency" value="divine">{{
          t(":currency_only_div")
        }}</ui-radio>
        <ui-radio v-model="filters.trade.currency" value="exalted_divine">{{
          t(":currency_exalted_div")
        }}</ui-radio>
      </div>
    </template>
  </ui-popover>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { useI18nNs } from "@/web/i18n";
import UiRadio from "@/web/ui/UiRadio.vue";
import UiPopover from "@/web/ui/Popover.vue";
import type { ItemFilters } from "../filters/interfaces";

export default defineComponent({
  components: { UiRadio, UiPopover },
  props: {
    filters: {
      type: Object as PropType<ItemFilters>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18nNs("online_filter");

    const displayCurrency = computed(() => {
      const curr = props.filters.trade.currency;
      if (!curr) return t(":currency_any");
      if (curr === "exalted") return t(":currency_only_exalted");
      if (curr === "chaos") return t(":currency_only_chaos");
      if (curr === "divine") return t(":currency_only_div");
      if (curr === "exalted_divine") return t(":currency_exalted_div");
      return curr;
    });

    return {
      t,
      displayCurrency,
      showWarning: () => Boolean(props.filters.trade.currency),
    };
  },
});
</script>
