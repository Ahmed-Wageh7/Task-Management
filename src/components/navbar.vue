<template>
  <nav class="flex justify-between items-center p-4 bg-white shadow relative">
    <h1 class="text-xl font-bold">Task Manager</h1>

    <button
      class="bg-green-600 hover:bg-green-700 transition-all text-white px-3 py-2 rounded-lg flex items-center gap-2"
      @click="openAddModal = true"
    >
      <span v-if="loading" class="loader-border"></span>
      + Add Task
    </button>

    <div
      v-if="openAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white p-6 rounded-lg w-full max-w-md relative"
        @keydown.esc="closeModal"
      >
        <h2 class="text-lg font-bold mb-4">Add New Task</h2>

        <p v-if="successMsg" class="text-green-600 mb-2">{{ successMsg }}</p>
        <p v-if="errorMsg" class="text-red-600 mb-2">{{ errorMsg }}</p>

        <form @submit.prevent="submitTask">
          <input
            v-model="newTask.title"
            type="text"
            placeholder="Title"
            class="w-full mb-3 p-2 border rounded"
            :class="{ 'border-red-500': validationErrors.title }"
            required
          />
          <p v-if="validationErrors.title" class="text-red-500 text-sm mb-2">
            {{ validationErrors.title }}
          </p>

          <select
            v-model="newTask.category_id"
            class="w-full mb-3 p-2 border rounded"
            :class="{ 'border-red-500': validationErrors.category_id }"
            required
          >
            <option value="" disabled>Select Category</option>
            <option
              v-for="cat in tasksStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
          <p
            v-if="validationErrors.category_id"
            class="text-red-500 text-sm mb-2"
          >
            {{ validationErrors.category_id }}
          </p>

          <textarea
            v-model="newTask.description"
            placeholder="Description"
            class="w-full mb-3 p-2 border rounded"
          ></textarea>

          <select
            v-model="newTask.priority"
            class="w-full mb-3 p-2 border rounded"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            v-model="newTask.due_date"
            type="date"
            class="w-full mb-3 p-2 border rounded"
          />

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-all"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 transition"
              :disabled="loading"
            >
              <span v-if="loading" class="loader-border"></span>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useTasksStore } from "../stored-data/index";
const tasksStore = useTasksStore();

const SUPABASE_URL = "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1/tasks";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE";

const emit = defineEmits(["task-added"]);
const openAddModal = ref(false);

const loading = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

const newTask = ref({
  title: "",
  category_id: "",
  description: "",
  priority: "",
  due_date: "",
});
const validationErrors = ref({});

function closeModal() {
  openAddModal.value = false;
  resetForm();
}
function resetForm() {
  newTask.value = {
    title: "",
    category_id: "",
    description: "",
    priority: "",
    due_date: "",
  };
  validationErrors.value = {};
  successMsg.value = "";
  errorMsg.value = "";
}
function validateForm() {
  const errors = {};
  if (!newTask.value.title?.trim()) errors.title = "Title is required";
  if (!newTask.value.category_id) errors.category_id = "Category is required";
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
}

// async function loadCategories() {
//   try {
//     const res = await axios.get(
//       "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1/categories?order=name.asc",
//       {
//         headers: {
//           apikey: SUPABASE_KEY,
//           Authorization: `Bearer ${SUPABASE_KEY}`,
//         },
//       }
//     );
//     categories.value = res.data;
//   } catch (e) {
//     console.error("Failed to load categories", e);
//   }
// }

async function submitTask() {
  if (!validateForm()) return;

  loading.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    const payload = {
      title: newTask.value.title,
      category_id: parseInt(newTask.value.category_id),
      description: newTask.value.description || null,
      priority: newTask.value.priority || null,
      due_date: newTask.value.due_date || null,
    };

    const res = await axios.post(SUPABASE_URL, payload, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });

    const addedTask = res.data[0];
    emit("task-added", addedTask);
    // tasksStore.addTaskFirst(addedTask);

    successMsg.value = "Task added successfully!";
    setTimeout(() => {
      closeModal();
    }, 1200);
  } catch (err) {
    console.error(err.response || err);
    errorMsg.value = "Failed to add task. Please try again.";
  } finally {
    loading.value = false;
  }
}

// onMounted(loadCategories);
</script>

<style scoped>
.loader-border {
  width: 16px;
  height: 16px;
  border: 2px solid #fff3;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
