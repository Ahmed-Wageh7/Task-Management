<template>
  <!-- ========== DESKTOP ========== -->
  <aside
    v-if="!isTablet && !isMobile"
    class="bg-white shadow h-full p-4 flex flex-col border-r border-gray-200 w-64"
  >
    <!-- status filters -->
    <ul class="space-y-2 flex-1">
      <li
        @click="setFilter('all')"
        class="group cursor-pointer p-2 rounded-lg flex items-center gap-3 transition-all duration-200 hover:bg-gray-100"
        :class="
          filterValue === 'all'
            ? 'bg-blue-50 border border-blue-200 shadow-sm ring-2 ring-blue-200/50'
            : ''
        "
      >
        <font-awesome-icon
          icon="list"
          class="text-lg flex-shrink-0 transition-colors"
          :class="
            filterValue === 'all'
              ? 'text-blue-600'
              : 'text-gray-600 group-hover:text-blue-500'
          "
        />
        <span
          class="font-medium whitespace-nowrap transition-colors"
          :class="
            filterValue === 'all'
              ? 'text-blue-700 font-semibold'
              : 'text-gray-900 group-hover:text-gray-900'
          "
        >
          All Tasks
        </span>
      </li>

      <li
        @click="setFilter('completed')"
        class="group cursor-pointer p-2 rounded-lg flex items-center gap-3 transition-all duration-200 hover:bg-gray-100"
        :class="
          filterValue === 'completed'
            ? 'bg-green-50 border border-green-200 shadow-sm ring-2 ring-green-200/50'
            : ''
        "
      >
        <font-awesome-icon
          icon="check"
          class="text-lg flex-shrink-0 transition-colors"
          :class="
            filterValue === 'completed'
              ? 'text-green-700'
              : 'text-green-600 group-hover:text-green-700'
          "
        />
        <span
          class="font-medium whitespace-nowrap transition-colors"
          :class="
            filterValue === 'completed'
              ? 'text-green-800 font-semibold'
              : 'text-gray-900 group-hover:text-gray-900'
          "
        >
          Completed
        </span>
      </li>

      <li
        @click="setFilter('pending')"
        class="group cursor-pointer p-2 rounded-lg flex items-center gap-3 transition-all duration-200 hover:bg-gray-100"
        :class="
          filterValue === 'pending'
            ? 'bg-yellow-50 border border-yellow-200 shadow-sm ring-2 ring-yellow-200/50'
            : ''
        "
      >
        <font-awesome-icon
          icon="hourglass-half"
          class="text-lg flex-shrink-0 transition-colors"
          :class="
            filterValue === 'pending'
              ? 'text-yellow-700'
              : 'text-yellow-600 group-hover:text-yellow-700'
          "
        />
        <span
          class="font-medium whitespace-nowrap transition-colors"
          :class="
            filterValue === 'pending'
              ? 'text-yellow-800 font-semibold'
              : 'text-gray-900 group-hover:text-gray-900'
          "
        >
          Pending
        </span>
      </li>
    </ul>

    <!-- categories with colors from api -->
    <div class="mt-6">
      <h2
        class="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide"
      >
        Categories
      </h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="setFilter('category', cat.id)"
          class="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium shadow-sm bg-gray-50 hover:bg-opacity-80 transition-all duration-200 relative overflow-hidden"
          :class="[
            isActiveCategory(cat.id)
              ? `bg-gradient-to-r shadow-md ring-2 ring-[${cat.color}]/30 scale-[1.02] border-2 border-[${cat.color}]`
              : 'hover:shadow-md hover:scale-[1.02]',
          ]"
          :style="{
            '--category-color': cat.color,
          }"
        >
          <div
            v-if="isActiveCategory(cat.id)"
            class="absolute inset-0 bg-gradient-to-r"
            :style="{
              background: `linear-gradient(90deg, ${
                cat.color
              }20, ${lightenColor(cat.color, 20)}20)`,
            }"
          ></div>

          <div class="relative z-10 flex-shrink-0">
            <img
              v-if="cat.icon_url"
              :src="getCategoryIcon(cat)"
              class="w-5 h-5 transition-all duration-200 group-hover:scale-110 drop-shadow-sm"
              :class="
                isActiveCategory(cat.id)
                  ? 'drop-shadow-lg shadow-white/50 scale-110'
                  : ''
              "
              alt=""
            />
            <div
              v-else
              class="w-5 h-5 rounded-full border-2 border-white/50 flex-shrink-0 shadow-md transition-all duration-200"
              :class="
                isActiveCategory(cat.id)
                  ? 'shadow-lg scale-110 ring-1 ring-white/70'
                  : 'group-hover:scale-110 group-hover:shadow-lg'
              "
              :style="{
                backgroundColor: cat.color,
                boxShadow: `0 0 0 2px ${cat.color}`,
              }"
            ></div>
          </div>

          <span
            class="relative z-10 font-medium transition-all duration-200 truncate"
            :class="
              isActiveCategory(cat.id)
                ? 'font-semibold drop-shadow-sm'
                : 'group-hover:font-semibold'
            "
            :style="{
              color: isActiveCategory(cat.id) ? cat.color : '',
            }"
          >
            {{ cat.name }}
          </span>
        </button>
      </div>
    </div>
  </aside>

  <!-- ========== TABLET ========== -->

  <aside
    v-else-if="isTablet"
    class="bg-white shadow h-full p-3 flex flex-col border-r border-gray-200 w-20"
  >
    <ul class="space-y-3 flex-1 mt-2">
      <li
        @click="setFilter('all')"
        class="cursor-pointer p-2 rounded-lg flex justify-center transition-all duration-200 hover:bg-gray-100 hover:scale-105"
        :class="
          filterValue === 'all'
            ? 'bg-blue-100 border-2 border-blue-300 shadow-md scale-105 ring-2 ring-blue-300/50'
            : ''
        "
        title="All Tasks"
      >
        <font-awesome-icon
          icon="list"
          class="text-xl transition-all duration-200"
          :class="
            filterValue === 'all'
              ? 'text-blue-600 scale-110 drop-shadow-md'
              : 'text-gray-600 hover:text-blue-500 hover:scale-110'
          "
        />
      </li>
      <li
        @click="setFilter('completed')"
        class="cursor-pointer p-2 rounded-lg flex justify-center transition-all duration-200 hover:bg-gray-100 hover:scale-105"
        :class="
          filterValue === 'completed'
            ? 'bg-green-100 border-2 border-green-300 shadow-md scale-105 ring-2 ring-green-300/50'
            : ''
        "
        title="Completed"
      >
        <font-awesome-icon
          icon="check"
          class="text-xl transition-all duration-200"
          :class="
            filterValue === 'completed'
              ? 'text-green-700 scale-110 drop-shadow-md'
              : 'text-green-600 hover:text-green-700 hover:scale-110'
          "
        />
      </li>
      <li
        @click="setFilter('pending')"
        class="cursor-pointer p-2 rounded-lg flex justify-center transition-all duration-200 hover:bg-gray-100 hover:scale-105"
        :class="
          filterValue === 'pending'
            ? 'bg-yellow-100 border-2 border-yellow-300 shadow-md scale-105 ring-2 ring-yellow-300/50'
            : ''
        "
        title="Pending"
      >
        <font-awesome-icon
          icon="hourglass-half"
          class="text-xl transition-all duration-200"
          :class="
            filterValue === 'pending'
              ? 'text-yellow-700 scale-110 drop-shadow-md'
              : 'text-yellow-600 hover:text-yellow-700 hover:scale-110'
          "
        />
      </li>
    </ul>

    <!-- categories with colors from api -->
    <div class="mt-4 space-y-3">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="setFilter('category', cat.id)"
        class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-gray-50 hover:bg-gray-100 hover:scale-110 transition-all duration-200 relative overflow-hidden"
        :class="
          isActiveCategory(cat.id)
            ? `shadow-lg scale-110 ring-2 ring-[${cat.color}]/40 border-2 border-[${cat.color}]`
            : ''
        "
        :title="cat.name"
        :style="{
          '--category-color': cat.color,
        }"
      >
        <!-- Active overlay -->
        <div
          v-if="isActiveCategory(cat.id)"
          class="absolute inset-0 bg-gradient-to-r rounded-xl opacity-30"
          :style="{
            backgroundColor: cat.color,
          }"
        ></div>

        <!-- Icon -->
        <img
          v-if="cat.icon_url"
          :src="getCategoryIcon(cat)"
          class="w-6 h-6 relative z-10 transition-all duration-200"
          :class="
            isActiveCategory(cat.id)
              ? 'drop-shadow-lg scale-110 shadow-white/50'
              : 'hover:scale-110 hover:drop-shadow-md'
          "
          alt=""
        />
        <div
          v-else
          class="w-6 h-6 rounded-full border-3 border-white/60 relative z-10 flex-shrink-0 shadow-lg transition-all duration-200"
          :class="
            isActiveCategory(cat.id)
              ? 'shadow-xl scale-110 ring-2 ring-white/80'
              : 'hover:scale-110 hover:shadow-xl'
          "
          :style="{
            backgroundColor: cat.color,
            boxShadow: `0 0 0 3px ${cat.color}`,
          }"
        ></div>
      </button>
    </div>
  </aside>

  <!-- ========== MOBILE TOP NAV ========== -->
  <nav
    v-else
    class="fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm md:hidden pt-1 pb-1 px-1"
  >
    <div class="flex justify-around items-stretch h-14 gap-1">
      <!-- Pending Button -->
      <button
        @click="setFilter('pending')"
        class="flex flex-col items-center justify-center p-1 text-xs font-medium transition-all active:scale-95 flex-1 rounded-lg"
        :class="[
          filterValue === 'pending'
            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm'
            : 'text-yellow-600 hover:bg-yellow-50',
        ]"
      >
        <font-awesome-icon icon="hourglass-half" class="text-lg mb-0.5" />
        <span class="leading-tight">Pending</span>
      </button>

      <!-- Completed Button -->
      <button
        @click="setFilter('completed')"
        class="flex flex-col items-center justify-center p-1 text-xs font-medium transition-all active:scale-95 flex-1 rounded-lg mx-0.5"
        :class="[
          filterValue === 'completed'
            ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
            : 'text-green-600 hover:bg-green-50',
        ]"
      >
        <font-awesome-icon icon="check" class="text-lg mb-0.5" />
        <span class="leading-tight">Done</span>
      </button>

      <!-- All Button -->
      <button
        @click="setFilter('all')"
        class="flex flex-col items-center justify-center p-1 text-xs font-medium transition-all active:scale-95 flex-1 rounded-lg"
        :class="[
          filterValue === 'all'
            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
            : 'text-gray-700 hover:bg-gray-50',
        ]"
      >
        <font-awesome-icon icon="list" class="text-lg mb-0.5" />
        <span class="leading-tight">All</span>
      </button>

      <!-- More Button -->
      <button
        @click="openMobileDrawer"
        class="flex flex-col items-center justify-center p-1 text-xs font-medium transition-all active:scale-95 flex-1 rounded-lg"
        :class="['text-gray-600 hover:bg-gray-50']"
      >
        <font-awesome-icon icon="ellipsis-v" class="text-lg mb-0.5" />
        <span class="leading-tight">More</span>
      </button>
    </div>
  </nav>

  <!-- ========== MOBILE DRAWER ========== -->
  <Teleport to="body">
    <Transition name="drawer-slide">
      <div
        v-if="mobileDrawer"
        class="fixed inset-0 bg-black/50 z-[1000] lg:hidden flex items-end justify-center"
        @click="mobileDrawer = false"
      >
        <div
          class="w-full h-[95vh] bg-white rounded-2xl p-4 shadow-2xl flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 pb-2 border-b">
            <h3 class="text-lg font-bold text-gray-900">Categories</h3>
            <button
              @click="mobileDrawer = false"
              class="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <font-awesome-icon icon="times" class="text-xl text-gray-500" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="
                  setFilter('category', cat.id);
                  mobileDrawer = false;
                "
                class="group flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-transparent"
                :class="
                  isActiveCategory(cat.id)
                    ? `shadow-xl ring-2 ring-[${cat.color}]/40 bg-gradient-to-br`
                    : ''
                "
                :style="{ '--category-color': cat.color }"
              >
                <div
                  class="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3 relative overflow-hidden"
                >
                  <img
                    v-if="cat.icon_url"
                    :src="getCategoryIcon(cat)"
                    class="w-10 h-10 z-10 transition-transform group-hover:scale-110 drop-shadow-sm"
                    alt=""
                  />
                  <div
                    v-else
                    class="w-12 h-12 rounded-full border-4 border-white/70 z-10 flex-shrink-0 shadow-2xl transition-all duration-200 group-hover:scale-110"
                    :style="{
                      backgroundColor: cat.color,
                      boxShadow: `0 0 0 4px ${cat.color}`,
                    }"
                  ></div>
                  <div
                    v-if="isActiveCategory(cat.id)"
                    class="absolute inset-0 ring-4 ring-[var(--category-color)]/50 rounded-2xl"
                  ></div>
                </div>

                <div class="text-center">
                  <div
                    class="font-medium text-sm leading-tight transition-colors truncate max-w-[6rem]"
                    :class="
                      isActiveCategory(cat.id)
                        ? 'font-bold drop-shadow-sm'
                        : 'group-hover:font-bold'
                    "
                    :style="{
                      color: isActiveCategory(cat.id) ? cat.color : '',
                    }"
                  >
                    {{ truncateName(cat.name) }}
                  </div>
                </div>
              </button>
            </div>

            <!-- No categories -->
            <div v-if="categories.length === 0" class="text-center py-16 mt-8">
              <font-awesome-icon
                icon="tags"
                class="text-5xl text-gray-300 mx-auto mb-4"
              />
              <p class="text-gray-500 text-lg font-medium mb-2">
                No categories yet
              </p>
              <p class="text-sm text-gray-400">
                Create categories to organize your tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});

import { ref, computed } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useTasksStore } from "../stored-data/";
import {
  faBars,
  faList,
  faCheck,
  faHourglassHalf,
  faTimes,
  faTags,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBars,
  faList,
  faCheck,
  faHourglassHalf,
  faTimes,
  faTags,
  faEllipsisV
);
const sidebarOpen = ref(false);

/* -------------------------------------------------
   reactive screen size
-------------------------------------------------- */
const width = ref(window.innerWidth);
window.addEventListener("resize", () => (width.value = window.innerWidth));
const isTablet = computed(() => width.value >= 640 && width.value < 1024);
const isMobile = computed(() => width.value < 640);

/* -------------------------------------------------
   injected shared state
-------------------------------------------------- */

const tasksStore = useTasksStore();

const categories = computed(() => tasksStore.categories);
const filter = computed({
  get: () => tasksStore.filter,
  set: (val) => (tasksStore.filter = val),
});

/* -------------------------------------------------
   computed filter value + active category checker
-------------------------------------------------- */
const filterValue = computed(() => {
  const { type } = filter.value;
  return type;
});

const isActiveCategory = (catId) => {
  return filter.value.type === "category" && filter.value.id === catId;
};

/* -------------------------------------------------
   mobile drawer
-------------------------------------------------- */
const mobileDrawer = ref(false);
function openMobileDrawer() {
  mobileDrawer.value = true;
}

/* -------------------------------------------------
   filter setter
-------------------------------------------------- */
function setFilter(type, id = null) {
  filter.value = { type, id };
  tasksStore.selectedTask = null;
}

/* -------------------------------------------------
   helpers
-------------------------------------------------- */
function truncateName(name) {
  return name.length > 12 ? name.slice(0, 12) + "..." : name;
}

function getCategoryIcon(cat) {
  if (!cat.icon_url) return "";
  return cat.icon_url.includes("color=")
    ? cat.icon_url.replace(/color=[^&]*/, `color=${cat.color.replace("#", "")}`)
    : `${cat.icon_url}?color=${cat.color.replace("#", "")}`;
}

function lightenColor(hex, percent) {
  let r = parseInt(hex[1] + hex[2], 16);
  let g = parseInt(hex[3] + hex[4], 16);
  let b = parseInt(hex[5] + hex[6], 16);

  r = r + (255 * percent) / 100;
  g = g + (255 * percent) / 100;
  b = b + (255 * percent) / 100;

  r = r > 255 ? 255 : r;
  g = g > 255 ? 255 : g;
  b = b > 255 ? 255 : b;

  r = Math.round(r).toString(16).padStart(2, "0");
  g = Math.round(g).toString(16).padStart(2, "0");
  b = Math.round(b).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.95);
}

.drawer-slide-enter-to,
.drawer-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>
