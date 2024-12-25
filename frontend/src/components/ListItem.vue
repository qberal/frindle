<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="flex items-center justify-items-start space-x-4 md:space-x-0 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div class="flex-shrink-0">
      <img
        :src="props.book.cover"
        :alt="props.book.name"
        class="w-16 h-24 object-cover rounded-md shadow-sm"
      />
    </div>
    <div class="flex flex-row justify-between w-full">
      <div class="m-0 sm:m-8 flex items-start flex-col text-start">
        <h3 class="text-lg font-semibold text-gray-900">{{ props.book.title }}</h3>
        <p class="text-sm text-gray-500">{{ props.book.author }}</p>
      </div>
      <div class="m-0 sm:m-8 sm:flex items-start flex-row hidden">
        <Badge variant="outline">{{ props.book.type }}</Badge>
        <Badge variant="outline" v-if="props.book.isPack">Pack</Badge>
      </div>
    </div>
  </div>
</template>

<style scoped>






</style>
