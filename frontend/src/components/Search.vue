<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const emit = defineEmits(['searchAction'])
const searchInput = ref('')

const handleSearch = () => {
  emit('searchAction', searchInput.value)
}
</script>

<template>
  <div class="flex flex-row gap-4 m-4">
    <Input placeholder="Search for a book" v-model="searchInput"></Input>
    <Button @click="handleSearch">Search</Button>
  </div>
</template>

<style scoped></style>
