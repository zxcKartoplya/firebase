<template>
	<div class="container">
		<button @click="loginWithGoogle" v-if="!user" class="btn">
			Войти с Google
		</button>
		<button @click="logout" v-else class="btn">Выйти</button>
		<div v-if="user" class="user-info">
			<h3 class="greeting">Привет, {{ user.displayName }}!</h3>
			<p class="user-id">Id: {{ user.uid }}</p>
			<div class="addInput">
				<input
					type="text"
					v-model="newThingName"
					placeholder="Add things"
					class="input"
				/>
				<button @click="addThings" class="btn">Добавить</button>
			</div>
			<CheckBox text="Для всех" />
			<CustomList
				title="Things community"
				:items="items"
				@edit="editThing"
				@delete="deleteThing"
			/>
		</div>
	</div>
</template>

<script setup>
import CheckBox from './components/CheckBox.vue'
import CustomList from './components/CustomList.vue'

import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { db } from './firebase'

const auth = getAuth()
const items = ref([])
const user = ref(null)
const thingsRef = collection(db, 'things')
const newThingName = ref('')

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
		await addDoc(thingsRef, {
			uid: user.value.uid,
			name: newThingName.value,
			createdAt: serverTimestamp(),
		})
		newThingName.value = ''
		await loadThings()
	} catch (error) {
		console.error('Ошибка при добавлении things:', error)
	}
}

const editThing = async item => {
	const newName = prompt('Введите новое имя для item:', item.name)
	if (newName) {
		const itemDoc = doc(thingsRef, item.id)
		try {
			await updateDoc(itemDoc, { name: newName })
			await loadThings()
		} catch (error) {
			console.error('Ошибка при обновлении things:', error)
		}
	}
}

const deleteThing = async id => {
	console.log(id)
	const itemDoc = doc(thingsRef, id)
	try {
		await deleteDoc(itemDoc)
		await loadThings()
	} catch (error) {
		console.error('Ошибка при удалении things:', error)
	}
}

const loadThings = async () => {
	const querySnapshot = await getDocs(thingsRef)
	items.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(() => {
	onAuthStateChanged(auth, currentUser => {
		user.value = currentUser
		loadThings()
	})
})
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
}

.user-info {
	margin-top: 20px;
}

.greeting {
	font-size: 1.25rem;
	font-weight: 600;
}

.user-id {
	color: #4b5563;
}

.addInput {
	display: flex;
	gap: 10px;
}

.input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	width: calc(100% - 20px);
}

.btn {
	padding: 10px 20px;
	border: none;
	background-color: #3b82f6;
	color: white;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.btn:hover {
	background-color: #2563eb;
}

.btn-secondary {
	padding: 5px 10px;
	background-color: #fbbf24;
	color: black;
	border-radius: 4px;
	cursor: pointer;
}

.btn-secondary:hover {
	background-color: #f59e0b;
}

.thing-name {
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
