<template>
  <div
    class="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 z-50"
  >
    <div class="relative w-12 h-12 mb-3">
      <div
        class="absolute inset-0 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin"
      ></div>
      <div
        class="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-300 animate-spin [animation-direction:reverse] [animation-duration:1.2s]"
      ></div>
    </div>

    <span class="text-white text-sm md:text-base font-medium">
      Loading tasks...
    </span>
  </div>
</template>

<script setup></script>

<style scoped></style>
