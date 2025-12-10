import { defineStore } from "pinia";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    categories: [],
    filter: { type: "all", id: null },
    loading: true,
  }),
  getters: {
    filteredTasks(state) {
      const { type, id } = state.filter;
      if (type === "all") return state.tasks;
      if (type === "completed")
        return state.tasks.filter((task) => task.completed);
      if (type === "pending")
        return state.tasks.filter((task) => !task.completed);
      if (type === "category" && id !== null)
        return state.tasks.filter((task) => task.category_id === id);
      return state.tasks;
    },
  },
  actions: {
    setTasks(tasks) {
      this.tasks = tasks;
    },
    setCategories(categories) {
      this.categories = categories;
    },
    setFilter(filter) {
      this.filter = filter;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    addTaskFirst(task) {
      this.tasks.unshift(task);
    },
  },
});
