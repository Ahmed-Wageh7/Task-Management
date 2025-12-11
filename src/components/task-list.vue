<template>
  <main
    class="flex-1 bg-gray-50 min-h-screen p-2 md:p-4 md:pt-0 pt-20 max-[500px]:px-0"
  >
    <Transition name="fade" mode="out-in">
      <div v-if="!selectedTask" :key="filterKey" class="">
        <h1 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">Tasks</h1>

        <!-- Tasks Container -->
        <div
          class="bg-white rounded-lg shadow-md p-3 md:p-6 border border-gray-200 h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] flex flex-col max-[500px]:h-[680px] max-[500px]:pl-2 max-[500px]:pr-0 max-[500px]:min-h-[680px]"
        >
          <!-- Header -->
          <div
            class="p-2 md:p-4 border-b border-gray-100 mb-3 md:mb-4 flex items-center justify-between"
          >
            <span class="text-base md:text-lg font-semibold text-gray-800">
              {{ filteredTasks?.length || 0 }} Tasks
            </span>
          </div>

          <!-- Tasks Content -->
          <div
            class="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-3 custom-scrollbar"
          >
            <!-- Loading -->
            <div
              v-if="loading"
              class="text-center py-16 md:py-20 text-gray-500"
            >
              <div
                class="w-10 h-10 md:w-12 md:h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 md:mb-4"
              ></div>
              Loading tasks...
            </div>

            <!-- Error -->
            <div
              v-else-if="error"
              class="text-center py-16 md:py-20 text-red-500"
            >
              {{ error }}
              <button
                @click="loadData"
                class="ml-2 text-blue-500 underline hover:text-blue-700 text-sm"
              >
                Retry
              </button>
            </div>

            <!-- Empty -->
            <div
              v-else-if="!filteredTasks?.length"
              class="text-center py-16 md:py-20 text-gray-500"
            >
              <!-- No tasks found. -->
            </div>

            <!-- Tasks List -->
            <div v-else class="space-y-2 md:space-y-3">
              <div
                v-for="task in filteredTasks"
                :key="task.id"
                class="p-3 md:p-6 bg-gray-50/80 hover:bg-white rounded-xl shadow-sm flex flex-col md:flex-row md:justify-between cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 task-card w-full"
                :style="{
                  borderLeft: '6px solid ' + getCategoryColor(task.category_id),
                }"
                @click="openTaskDetail(task)"
              >
                <div class="flex-1 w-full md:min-w-0 mb-2 md:mb-0">
                  <h2
                    class="font-bold text-base md:text-lg mb-2 leading-tight truncate"
                  >
                    {{ task.title }}
                  </h2>
                  <p
                    class="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2"
                  >
                    {{ task.description || "No description" }}
                  </p>
                  <!-- Tags - عمودي على الموبايل، أفقي على الديسكتوب -->
                  <div
                    class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-1 md:gap-3 text-xs"
                  >
                    <span
                      class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium"
                    >
                      {{ getCategoryName(task.category_id) || "N/A" }}
                    </span>
                    <span
                      class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full"
                    >
                      {{
                        task.priority
                          ? task.priority.toUpperCase()
                          : "NO PRIORITY"
                      }}
                    </span>
                    <span
                      :class="
                        task.completed ? 'text-green-600' : 'text-gray-500'
                      "
                    >
                      {{ task.completed ? "✅ Completed" : "⏳ Pending" }}
                    </span>
                    <span v-if="task.due_date" class="text-blue-600">
                      📅 {{ formatDate(task.due_date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Detail View -->
      <div
        v-else
        class="bg-white rounded-xl shadow-lg w-full max-w-md md:max-w-3xl mx-auto p-3 md:p-6 border border-gray-200 h-[calc(100vh-120px)] md:h-[calc(100vh-150px)] flex flex-col overflow-hidden"
      >
        <div
          class="flex justify-between items-center mb-3 md:mb-4 pb-2 md:pb-3 border-b border-gray-100 flex-shrink-0"
        >
          <button
            @click="selectedTask = null"
            class="px-2 md:px-3 py-1.5 bg-gray-200 text-xs md:text-sm rounded hover:bg-gray-300 transition flex items-center gap-1"
          >
            ← Back
          </button>
          <div class="flex gap-1">
            <button
              @click="openEditModal(selectedTask)"
              class="px-2 md:px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition flex items-center gap-1"
            >
              ✏️ Edit
            </button>
            <button
              @click="confirmDelete(selectedTask.id)"
              class="px-2 md:px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition flex items-center gap-1"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 p-2 md:p-3 space-y-2 md:space-y-3 overflow-y-auto">
          <div class="flex-shrink-0">
            <h2
              class="text-xl md:text-2xl font-black text-gray-900 mb-1 truncate"
            >
              {{ selectedTask.title }}
            </h2>
            <div class="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
              <span
                class="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs font-bold"
              >
                {{ getCategoryName(selectedTask.category_id) || "N/A" }}
              </span>
              <span
                v-if="selectedTask.priority"
                class="px-2 py-1 text-xs font-bold rounded-full"
                :class="{
                  'bg-red-100 text-red-800': selectedTask.priority === 'high',
                  'bg-yellow-100 text-yellow-800':
                    selectedTask.priority === 'medium',
                  'bg-green-100 text-green-800':
                    selectedTask.priority === 'low',
                }"
              >
                {{ selectedTask.priority.toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Image -->
          <div
            v-if="selectedTask.image_url"
            class="w-full h-24 max-[440px]:h-40 md:h-[30vh] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
          >
            <img
              :src="selectedTask.image_url"
              @error="onImageError"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Description -->
          <div v-if="selectedTask.description" class="flex-shrink-0">
            <h3
              class="font-semibold text-xs md:text-sm text-gray-700 mb-2 flex items-center gap-1"
            >
              Description
            </h3>
            <div
              class="text-sm md:text-base text-gray-600 leading-tight line-clamp-3 bg-gray-50 p-2 md:p-3 rounded-lg border"
            >
              {{ selectedTask.description }}
            </div>
          </div>

          <!-- Details Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-shrink-0"
          >
            <!-- Due Date -->
            <div v-if="selectedTask.due_date" class="space-y-1">
              <span class="text-xs text-gray-500 font-medium block">
                Due Date</span
              >
              <span class="font-bold text-base md:text-lg text-blue-600">
                {{ formatDate(selectedTask.due_date) }}
              </span>
            </div>

            <!-- Status -->
            <div class="space-y-1">
              <span class="text-xs text-gray-500 font-medium block"
                >✅ Status</span
              >
              <span
                :class="
                  selectedTask.completed
                    ? 'text-green-600 font-bold text-base md:text-lg'
                    : 'text-gray-500 font-medium'
                "
              >
                {{ selectedTask.completed ? "COMPLETED" : "PENDING" }}
              </span>
            </div>

            <!-- Created Date -->
            <div class="space-y-1 col-span-1 md:col-span-2">
              <span class="text-xs text-gray-500 font-medium block">
                Created</span
              >
              <span class="text-xs md:text-sm text-gray-600 font-medium">
                {{ formatDate(selectedTask.created_at) }}
              </span>
            </div>
          </div>

          <!-- Completion Toggle -->
          <div class="flex-shrink-0 pt-2">
            <label
              class="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-100 cursor-pointer hover:shadow-md transition-all w-full"
            >
              <input
                type="checkbox"
                :checked="selectedTask.completed"
                @change="toggleCompletion(selectedTask)"
                class="w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 border-gray-400 appearance-none checked:bg-white checked:border-green-600 checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 relative"
              />
              <div>
                <span class="font-bold text-sm md:text-lg text-green-800 block">
                  {{ selectedTask.completed ? "Completed" : "Pending" }}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Modal -->
    <div
      v-if="editModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      @click.self="closeEditModal"
    >
      <div
        class="bg-white p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
      >
        <h2 class="text-xl md:text-2xl font-bold mb-6 text-gray-900">
          Edit Task
        </h2>
        <form @submit.prevent="submitEditTask" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Title</label
            >
            <input
              v-model="editTask.title"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Category</label
            >
            <select
              v-model="editTask.category_id"
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Description</label
            >
            <textarea
              v-model="editTask.description"
              class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              rows="3"
              placeholder="Description (optional)"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Priority</label
              >
              <select
                v-model="editTask.priority"
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Due Date</label
              >
              <input
                v-model="editTask.due_date"
                type="date"
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div
            class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6"
          >
            <button
              type="button"
              @click="closeEditModal"
              class="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="deleteId !== null"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      @click.self="deleteId = null"
    >
      <div
        class="bg-white p-6 md:p-8 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200"
      >
        <div class="text-center mb-6">
          <div
            class="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-2xl mx-auto flex items-center justify-center mb-4"
          >
            <span class="text-xl md:text-2xl">🗑️</span>
          </div>
          <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Confirm Delete
          </h2>
          <p class="text-gray-600 text-sm md:text-base">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
        </div>
        <div class="flex gap-3 justify-end">
          <button
            @click="deleteId = null"
            class="flex-1 px-4 md:px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="flex-1 px-4 md:px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold shadow-md"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

import { useTasksStore } from "../stored-data/index";
import { computed } from "vue";
import { watch } from "vue";

const taskStore = useTasksStore();

const filteredTasks = computed(() => taskStore.filteredTasks);
const categories = computed(() => taskStore.categories);
const rootTasks = computed(() => taskStore.tasks);

const selectedTask = ref(null);
const editModalOpen = ref(false);
const editTask = ref({});
const deleteId = ref(null);
const loading = ref(false);
const error = ref("");

const BASE_URL = "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtieWJkdGFjb3F2Z2NpanJremt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzUwNjAsImV4cCI6MjA3MTYxMTA2MH0.SAF_9jupuaVLHq0l7Zbew7t6avUdg_UkdVGqLZmHTQE";
const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const getCategoryName = (id) =>
  categories?.value?.find((c) => c.id === id)?.name ?? "N/A";
const getCategoryColor = (id) =>
  categories?.value?.find((c) => c.id === id)?.color ?? "#3b82f6";

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const filterKey = computed(() => {
  return `${taskStore.filter.type}-${taskStore.filter.id || "all"}`;
});

watch(
  () => taskStore.filter,
  () => {
    selectedTask.value = null;
  },
  { deep: true }
);

async function toggleCompletion(task) {
  const newStatus = !task.completed;
  task.completed = newStatus;
  try {
    await axios.patch(
      `${BASE_URL}/tasks?id=eq.${task.id}`,
      { completed: newStatus },
      { headers }
    );
    const t = rootTasks?.value?.find((t) => t.id === task.id);
    if (t) t.completed = newStatus;
  } catch (e) {
    task.completed = !newStatus;
    console.error("Update failed:", e);
  }
}

function openTaskDetail(task) {
  selectedTask.value = { ...task };
}

function onImageError(e) {
  e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
}

function openEditModal(task) {
  editTask.value = { ...task };
  editModalOpen.value = true;
}

function closeEditModal() {
  editModalOpen.value = false;
}

async function submitEditTask() {
  const payload = {
    title: editTask.value.title,
    category_id: Number(editTask.value.category_id),
    description: editTask.value.description || null,
    priority: editTask.value.priority || null,
    due_date: editTask.value.due_date || null,
    completed: editTask.value.completed || false,
  };
  try {
    await axios.patch(`${BASE_URL}/tasks?id=eq.${editTask.value.id}`, payload, {
      headers,
    });
    const t = rootTasks?.value?.find((t) => t.id === editTask.value.id);
    if (t) Object.assign(t, payload);
    if (selectedTask.value?.id === editTask.value.id)
      Object.assign(selectedTask.value, payload);
    closeEditModal();
  } catch (e) {
    console.error("Edit failed:", e);
  }
}

function confirmDelete(id) {
  deleteId.value = id;
}

async function handleDelete() {
  if (!deleteId.value) return;
  try {
    await axios.delete(`${BASE_URL}/tasks?id=eq.${deleteId.value}`, {
      headers,
    });
    const idx = rootTasks?.value?.findIndex((t) => t.id === deleteId.value);
    if (idx > -1) rootTasks.value.splice(idx, 1);
    if (selectedTask.value?.id === deleteId.value) selectedTask.value = null;
    deleteId.value = null;
  } catch (e) {
    console.error("Delete failed:", e);
  }
}

const loadData = async () => {
  loading.value = true;
  error.value = "";
  try {
    // Refresh logic
  } catch (e) {
    error.value = "Failed to load tasks";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.line-clamp-2,
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.task-card {
  max-width: 100%;
  word-break: break-word;
  overflow: hidden;
}
.task-card:hover {
  transform: translateY(-1px);
}

/* منع السكرول الأفقي */
@supports (overflow-x: clip) {
  .task-card {
    overflow-x: clip;
  }
}
</style>
