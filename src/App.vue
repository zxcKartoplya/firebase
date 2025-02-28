<template>
	<div class="container">
		<button @click="loginWithGoogle" v-if="!user" class="btn">
			Log in with Google
		</button>
		<button @click="logout" v-else class="btn">Logout</button>
		<div v-if="user" class="user-info">
			<h3 class="greeting">Hello, {{ user.displayName }}!</h3>
			<p class="user-id">Id: {{ user.uid }}</p>
			<div class="addInput">
				<input
					type="text"
					v-model="newThingName"
					placeholder="Add thing"
					class="input"
				/>
				<button @click="addThings" class="btn">Add</button>
			</div>
			<CheckBox text="For all users" v-model="isPublic" />
			<CustomList
				title="Things community"
				:items="publicItems"
				@edit="editThing"
				@delete="deleteThing"
			/>
			<CustomList
				title="Private things"
				:items="privateItems"
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
const publicItems = ref([])
const privateItems = ref([])
const user = ref(null)
const publicRef = collection(db, 'things')
const privateItemsRef = uid => collection(db, `users/${uid}/things`)
const newThingName = ref('')
const isPublic = ref(false)

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
	if (!newThingName.value.trim()) {
		return
	}

	try {
		if (isPublic.value) {
			await addDoc(publicRef, {
				name: newThingName.value,
				createdAt: serverTimestamp(),
				avatar: user.value.photoURL,
				user_name: user.value.displayName,
			})
		} else {
			const privateRef = privateItemsRef(user.value.uid)
			await addDoc(privateRef, {
				name: newThingName.value,
				uid: user.value.uid,
				createdAt: serverTimestamp(),
				avatar: user.value.photoURL,
				user_name: user.value.displayName,
			})
		}
		newThingName.value = ''
		await loadThings()
	} catch (error) {
		console.error('Ошибка при добавлении things:', error)
	}
}

const editThing = async item => {
	const newName = prompt('Введите новое имя для item:', item.name)
	if (newName) {
		const itemDoc = isPublic.value
			? doc(publicRef, item.id)
			: doc(privateItemsRef(user.value.uid), item.id)

		try {
			await updateDoc(itemDoc, { name: newName })
			await loadThings()
		} catch (error) {
			console.error('Ошибка при обновлении things:', error)
		}
	}
}

const deleteThing = async id => {
	const itemDoc = isPublic.value
		? doc(publicRef, id)
		: doc(privateItemsRef(user.value.uid), id)

	try {
		await deleteDoc(itemDoc)
		await loadThings()
	} catch (error) {
		console.error('Ошибка при удалении things:', error)
	}
}

const loadThings = async () => {
	try {
		const publicSnapshot = await getDocs(publicRef)
		publicItems.value = publicSnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}))

		if (user.value) {
			const privateSnapshot = await getDocs(privateItemsRef(user.value.uid))
			privateItems.value = privateSnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))
		}
	} catch (error) {
		console.error('Ошибка при загрузке вещей:', error)
	}
}

onMounted(() => {
	onAuthStateChanged(auth, currentUser => {
		user.value = currentUser
		if (user.value) {
			loadThings()
		} else {
			publicItems.value = []
			privateItems.value = []
		}
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
