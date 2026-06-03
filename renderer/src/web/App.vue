<template>
  <div id="app" class="text-sm font-poe-sc">
    <OverlayWindow />
  </div>
</template>

<script setup lang="ts">
import OverlayWindow from "./overlay/OverlayWindow.vue";
</script>

<style lang="postcss">
@import url("@fortawesome/fontawesome-free/css/fontawesome.min.css");
@import url("@fortawesome/fontawesome-free/css/solid.min.css");
@import url("@fortawesome/fontawesome-free/css/regular.min.css");
@import url("../assets/font.css");
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --glass-bg: rgba(10, 10, 12, 0.88);
  --glass-bg-solid: rgba(18, 18, 22, 0.96);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-border-hover: rgba(255, 255, 255, 0.12);
  --accent: #14b8a6;
  --accent-hover: #2dd4bf;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --danger: #f87171;
}

.table-stripped tbody tr:nth-child(odd) {
  background: rgba(255, 255, 255, 0.03);
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: space-between;

  :focus {
    outline: 0;
  }
}

.layout-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}

::-webkit-scrollbar {
  width: 0.375rem;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.25rem;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input,
select,
textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  border-radius: 0.375rem;
  transition: border-color 0.15s ease, background 0.15s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.06);
}

.btn {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  line-height: 1;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.15s ease;
  cursor: pointer;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: var(--glass-border-hover);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Glass panel utility */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.glass-solid {
  background: var(--glass-bg-solid);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
</style>
