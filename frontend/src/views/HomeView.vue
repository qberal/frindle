<script setup lang="ts">
import Search from '@/components/Search.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import BookPopover from '@/components/BookPopover.vue'

interface Book {
  id: number
  title: string
  // Add other properties as needed
}

const books = ref<Book[]>([])

const searchAction = (query: string) => {
  console.log(query)
  axios
    .get(`/api/search?query=${query}`)
    .then((response) => {
      books.value = response.data
      const infoElement = document.getElementById('info')
      if (infoElement) {
        infoElement.innerText = 'Résultats de la recherche'
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

onMounted(() => {
  axios
    .get('/api/latest')
    .then((response) => {
      books.value = response.data
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <main class="px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center py-8 sm:py-12">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Frindle</h1>
      <h2 id="info" class="text-xl sm:text-2xl text-gray-600">Derniers livres ajoutés</h2>
    </div>

    <Search @search-action="searchAction" class="w-full max-w-md mx-auto mb-8"/>

    <div class="grid gap-4 sm:gap-6 sm:mx-16">
      <BookPopover
        v-for="book in books"
        :key="book.id"
        :book="book"
        class="w-full"
      />
    </div>
  </main>
</template>
