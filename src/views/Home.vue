<template>
  <div class="min-h-screen flex relative">
    <Spinner v-if="taskStore.loading" />

    <Sidebar />

    <div class="flex-1 flex flex-col">
      <Navbar @task-added="addTaskFirst" />

      <main class="flex-1 p-6 bg-gray-50 overflow-auto">
        <TaskList />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/navbar.vue";
import Sidebar from "../components/sidebar.vue";
import TaskList from "../components/task-list.vue";
import Spinner from "../components/spinner.vue";
import { getTasks, getCategories } from "../api/api.js";
import { useTasksStore } from "../stored-data/index.js";

const taskStore = useTasksStore();

(async function load() {
  taskStore.setLoading(true);
  const [cats, tks] = await Promise.all([getCategories(), getTasks()]);
  taskStore.setCategories(cats ?? []);
  taskStore.setTasks(tks ?? []);
  taskStore.setLoading(false);
})();

function addTaskFirst(task) {
  taskStore.addTaskFirst(task);
}
</script>

<style scoped></style>
