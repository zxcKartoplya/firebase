<template>
	<div>
		<button @click="authorization.login">Авторизоваться</button>
		<button @click="authorization.logout">Выйти</button>
	</div>
</template>

<script setup>
import { collection, getDocs } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { db } from './firebase'
import { authorization } from './providers/authorization'

const items = ref([])

const try_add = () => {
	dk.collection('test').add({ name: 'test' })
}

onMounted(async () => {
	const querySnapshot = await getDocs(collection(db, 'test'))
	items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})
</script>
