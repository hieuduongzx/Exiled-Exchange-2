<template>
  <transition
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__backOutDown"
  >
    <div :class="$style.widget" v-if="show">
      <div :class="$style.box">
        <div class="py-2 px-4">
          <div class="text-base">Exiled Exchange 2</div>
          <p>{{ t("app_is_ready") }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { Host } from "@/web/background/IPC";
import { AppConfig } from "@/web/Config";

const { t } = useI18n();

const show = shallowRef(false);

Host.onEvent("MAIN->OVERLAY::overlay-attached", () => {
  if (!show.value && AppConfig().showAttachNotification) {
    show.value = true;
    setTimeout(() => {
      show.value = false;
    }, 2500);
  }
});
</script>

<style lang="postcss" module>
.widget {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  bottom: 20%;
}

.box {
  position: relative;
  display: flex;
  background: rgba(10, 10, 12, 0.92);
  backdrop-filter: blur(16px);
  color: #e5e7eb;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.box::before {
  position: absolute;
  content: "";
  background: url("/images/jeweler.png") no-repeat top right/contain;
  right: 100%;
  width: 100%;
  height: 100%;
  max-width: 78px;
  @apply mr-2;
  pointer-events: none;
  filter: drop-shadow(2px 4px 6px #000);
}
</style>
