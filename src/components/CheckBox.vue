<template>
	<label class="checkbox">
		<input type="checkbox" v-model="model" />
		<span class="checkbox-indicator"></span>
		{{ props.text }}
	</label>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
	text: String,
})

const model = defineModel()
</script>

<style scoped>
.checkbox input {
	display: none;
}

.checkbox {
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;
	margin-top: 10px;
}

.checkbox-indicator {
	content: '';
	width: 16px;
	height: 16px;
	border: 2px solid #3b82f6;
	border-radius: 4px;
	margin-right: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.4s;
}

.checkbox input:checked + .checkbox-indicator {
	background-color: #3b82f6;
	color: white;
}

.checkbox input:checked + .checkbox-indicator::after {
	content: '✔';
	color: white;
	font-size: 14px;
}
</style>
