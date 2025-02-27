<template>  
  <div>  
    <h1>Данные из Firestore</h1>  
    {{ items }}
  </div>  
</template>  

<script setup>  
import { collection, getDocs } from "firebase/firestore"
import { onMounted, ref } from 'vue'
import { db } from "./firebase"

const items = ref([]);   

onMounted(async () => {  
  const querySnapshot = await getDocs(collection(db, "test"));  
  items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));   
});  
</script>  

<style>  
/* Ваши стили */  
</style>