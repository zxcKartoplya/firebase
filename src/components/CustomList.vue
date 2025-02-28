<template>
	<p class="things-title">{{ props.title }}</p>
	<ul class="things-list">
		<li
			v-for="item in props.items"
			:key="item.id"
			class="thing-item"
			@mousemove="setShowDate(item.id, true)"
			@mouseout="setShowDate(item.id, false)"
		>
			<span class="thing-name">{{ item.name }}</span>
			<div class="date" v-show="shownDates[item.id]">
				{{ formatFirestoreDate(item.createdAt) }}
			</div>
			<div class="button-container">
				<button @click="$emit('edit', item)" class="btn">Изменить</button>
				<button @click="$emit('delete', item.id)" class="btn-danger">
					Удалить
				</button>
			</div>
		</li>
	</ul>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
	title: String,
	items: Array,
})

const shownDates = ref({})

const setShowDate = (id, show) => {
	shownDates.value[id] = show
}

const formatFirestoreDate = timestamp => {
	if (!timestamp || typeof timestamp.seconds !== 'number') {
		return 'Неверная дата'
	}

	const date = new Date(timestamp.seconds * 1000)
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true,
	}

	return date.toLocaleString('ru-RU', options)
}
</script>

<style scoped>
.things-title {
	margin-top: 20px;
	font-weight: bold;
}
.things-list {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.thing-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	border-radius: 6px;
	background-color: #ffffff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	transition: background-color 0.3s;
}

.thing-item:hover {
	background-color: #f9fafb;
}
.button-container {
	display: flex;
	gap: 10px;
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
.btn-danger {
	padding: 5px 10px;
	background-color: #ef4444;
	color: white;
	border-radius: 4px;
	border: none;
}
.btn-danger:hover {
	background-color: #dc2626;
}
.date {
	font-size: 14px;
	color: #4b5563c0;
}
</style>
