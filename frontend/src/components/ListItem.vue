<script setup lang="ts">
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div class="flex-shrink-0">
      <img :src="props.book.cover" :alt="props.book.name" class="w-16 h-24 object-cover rounded-md shadow-sm" />
    </div>
    <div class="flex-grow">
      <h3 class="text-lg font-semibold text-gray-900">{{ props.book.name }}</h3>
      <p class="text-sm text-gray-500">{{ props.book.size }}</p>
    </div>
  </div>
</template>

<style scoped></style>
