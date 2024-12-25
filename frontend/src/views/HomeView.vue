<script setup lang="ts">
import Search from '@/components/Search.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import BookPopover from '@/components/BookPopover.vue'

const books = ref([])

const searchAction = (query: string) => {
  console.log(query)
  axios
    .get(`/api/search?query=${query}`)
    .then((response) => {
      books.value = response.data
      document.getElementById('info').innerText = 'Résultats de la recherche'
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
  <main>

    <h2 class="text-5xl">Frindle</h2>
    <h3 id="info">Derniers livres ajoutés</h3>
    <Search @search-action="searchAction"/>
    <div class="flex flex-col">
      <BookPopover :book="book" v-for="book in books" :key="book.id" />
    </div>
  </main>
</template>
