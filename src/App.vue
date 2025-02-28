<template>  
	<div class='flex gap-4'>  
		<button @click="loginWithGoogle">Войти с Google</button>  
		<button @click="logout">Выйти</button>  
		<div v-if="user">  
			<h3>Привет, {{ user.displayName }}!</h3>  
			<p>Id: {{ user.uid }}</p>  
			<button @click="addThings">Добавить things</button>  
			<p>things:</p>  
			<ul>  
				<li v-for="item in items" :key="item.id">  
					{{ item.name }}   
					<button @click="editThing(item)">Изменить</button>  
					<button @click="deleteThing(item.id)">Удалить</button>  
				</li>  
			</ul>  
		</div>  
	</div>  
</template>  

<script setup>  
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { db } from './firebase'

const auth = getAuth()  
const items = ref([])  
const user = ref(null)  
const thingsRef = collection(db, 'things')  

const loginWithGoogle = async () => {  
	const provider = new GoogleAuthProvider()  
	try {  
		const result = await signInWithPopup(auth, provider)  
		user.value = result.user  
	} catch (error) {  
		console.error('Ошибка при входе через Google:', error)  
	}  
}  

const logout = async () => {  
	try {  
		await signOut(auth)  
	} catch (error) {  
		console.error('Ошибка при выходе:', error)  
	}  
}  

const addThings = async () => {  
	try {  
		await addDoc(thingsRef, { name: 'New thing' })  
		await loadThings();  
	} catch (error) {  
		console.error('Ошибка при добавлении things:', error)  
	}  
}  

const editThing = async (item) => {  
	const newName = prompt('Введите новое имя для item:', item.name);  
	if (newName) {  
		const itemDoc = doc(thingsRef, item.id);  
		try {  
			await updateDoc(itemDoc, { name: newName });  
			await loadThings();  
		} catch (error) {  
			console.error('Ошибка при обновлении things:', error);  
		}  
	}  
}  

const deleteThing = async (id) => {  
	const itemDoc = doc(thingsRef, id);  
	try {  
		await deleteDoc(itemDoc);  
		await loadThings();
	} catch (error) {  
		console.error('Ошибка при удалении things:', error);  
	}  
}  

const loadThings = async () => {  
	const querySnapshot = await getDocs(thingsRef)  
	items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))  
}  

onMounted(() => {  
	onAuthStateChanged(auth, (currentUser) => {  
		user.value = currentUser  
		loadThings();   
	})  
})  
</script>