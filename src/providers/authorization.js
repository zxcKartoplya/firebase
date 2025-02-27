import 'firebase/auth' // Импортируем модуль аутентификации
import firebase from '../firebase' // Импорт базовой функциональности

// Создание экземпляра GoogleAuthProvider
const provider = new firebase.auth.GoogleAuthProvider()

export const authorization = {
	logout: () => {
		return firebase.auth().signOut()
	},

	login: () => {
		return firebase.auth().signInWithPopup(provider)
	},
}
