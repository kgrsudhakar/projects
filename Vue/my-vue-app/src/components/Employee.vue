<script setup>
import { ref } from 'vue';
import axios from 'axios';

const firstName = ref('');
const lastName = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const firstNames = [
  'John',
  'David',
  'Michael',
  'Robert',
  'James',
  'Daniel',
  'Thomas'
];

const lastNames = [
  'Smith',
  'Johnson',
  'Brown',
  'Williams',
  'Taylor',
  'Anderson',
  'Wilson'
];

function getRandomItem(items) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function generateRandomName() {
  firstName.value = getRandomItem(firstNames);
  lastName.value = getRandomItem(lastNames);
}

async function submitForm() {

  error.value = '';
  success.value = '';

  // Generate random data before submitting
  generateRandomName();

  // Validation
  if (!firstName.value || !lastName.value) {
    error.value = 'First name and last name are required';
    return;
  }

  const request = {
    firstName: firstName.value,
    lastName: lastName.value
  };

  try {

    loading.value = true;

    const response = await axios.post(
      '/api/users',
      request
    );

    console.log('API Response:', response.data);

    success.value = 'User created successfully';

  } catch (err) {

    console.error('API Error:', err);

    error.value = 'Unable to create user';

  } finally {

    loading.value = false;
  }
}
</script>

<template>

  <form @submit.prevent="submitForm">

    <div>
      <label>First Name</label>

      <input
        v-model="firstName"
        type="text"
        placeholder="First Name"
      />
    </div>

    <div>
      <label>Last Name</label>

      <input
        v-model="lastName"
        type="text"
        placeholder="Last Name"
      />
    </div>

    <br />

    <button
      type="button"
      @click="generateRandomName"
    >
      Generate Random Name
    </button>

    <button
      type="submit"
      :disabled="loading"
    >
      {{ loading ? 'Submitting...' : 'Submit' }}
    </button>

    <p v-if="success">
      {{ success }}
    </p>

    <p v-if="error">
      {{ error }}
    </p>

  </form>

</template>