<script setup lang="ts">
import Search from '@/components/Search.vue'
import ListItem from '@/components/ListItem.vue'

const  book = {
  title: 'The Pragmatic Programmer',
  author: 'Andrew Hunt and David Thomas',
  cover: 'https://m.media-amazon.com/images/I/71KWpItR2kL._AC_UF1000,1000_QL80_.jpg',
}
</script>

<template>
  <main>
    <Search />
    <ListItem :book="book"
    ></ListItem>
  </main>
</template>
