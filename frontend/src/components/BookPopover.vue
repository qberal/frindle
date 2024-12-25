<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { Button } from '@/components/ui/button'

import ListItem from '@/components/ListItem.vue'
import axios from 'axios'
import { ref } from 'vue'
import { Badge } from '@/components/ui/badge'

const isOpen = ref(false)

const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})

const addBookToKindle = (id: number) => {
  axios
    .get(`/api/download/${id}`)
    .then((response) => {
      if (response.status === 200) {
        // Close the drawe
        // Show a toast (implementation not shown)
        isOpen.value = false
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<template>
  <Drawer ref="drawerRef" v-model:open="isOpen">
    <DrawerTrigger>
      <ListItem :book="props.book" />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle class="flex items-center justify-center"
          >Voulez-vous ajouter ce livre à votre kindle?
        </DrawerTitle>
      </DrawerHeader>

      <div class="flex items-center justify-center flex-col">
        <h4 class="text-start text-lg font-semibold text-gray-900">{{ props.book.title }}</h4>
        <p class="text-sm text-gray-500">{{ props.book.author || 'Auteur' }}</p>

        <img
          :src="props.book.cover"
          :alt="props.book.name"
          class="w-32 48 object-cover rounded-md shadow-sm flex items-center justify-center"
        />
        <div>
          <Badge variant="outline">{{ props.book.type }}</Badge>
          <Badge variant="outline" v-if="props.book.isPack">Pack</Badge>
        </div>
        <p>Titre original: {{ props.book.name }}</p>
      </div>

      <DrawerFooter class="flex items-center flex-1">
        <Button type="submit" class="" v-on:click="addBookToKindle(props.book.id)">Ajouter</Button>
        <DrawerClose>
          <Button class="" variant="outline">Annuler</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
