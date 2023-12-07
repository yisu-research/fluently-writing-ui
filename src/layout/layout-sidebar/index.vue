<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { CalendarIcon, Cog6ToothIcon, HomeIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import ButtonPersonalCenter from '@/layout/button-personal-center/index.vue'
import ButtonNewChat from '@/layout/button-new-chat/index.vue'
import { IconLogo } from '@/components/icons'
import { SvgIcon } from '@/components/common'

defineProps({
  sidebarOpen: Boolean,
})

const emit = defineEmits(['update:sidebarOpen'])

const navigation = ref([
  { name: 'Dashboard-1', href: '#', icon: HomeIcon, current: true },
  { name: 'Dashboard-2', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-3', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-4', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-5', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-6', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-7', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-8', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-9', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-10', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-11', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-12', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-13', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-14', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-15', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-16', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-17', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-18', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-19', href: '#', icon: HomeIcon, current: false },
  { name: 'Dashboard-20', href: '#', icon: HomeIcon, current: false },
])

const loadBox = ref<HTMLElement>()

function toggleSidebar() {
  emit('update:sidebarOpen', false)
}

const page = ref(1)

onMounted(() => {
  // api.getChatListApi({ state: 'active', page: 1, limit: 3 }).then((res) => {
  //   console.log(res)
  // })
  init()
})

async function init() {
  if (loadBox.value) {
    await nextTick(() => {
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const ratio = entries[0].intersectionRatio
        if (ratio > 0) {
          page.value++
          setTimeout(() => {
            navigation.value.push({ name: `Calendar-${page.value}`, href: '#', icon: CalendarIcon, current: false })
          }, 2000)
        }
      })
      observer.observe(loadBox.value)
    })
  }
}

const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]
</script>

<template>
  <TransitionRoot as="template" :show="sidebarOpen">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="toggleSidebar">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/80" />
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative flex flex-1 w-full max-w-xs mr-16">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 flex justify-center w-16 pt-5 left-full">
                <button type="button" class="-m-2.5 p-2.5" @click="toggleSidebar">
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="w-6 h-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex flex-col px-6 pb-4 overflow-y-auto bg-white grow gap-y-5">
              <div class="flex items-center h-16 gap-2 shrink-0">
                <IconLogo class="w-auto h-8 text-teal-400 sm:h-8 sm:w-8" />
                <p
                  class="text-lg font-black text-transparent sm:text-xl bg-gradient-to-r from-teal-500 to-emerald-300 bg-clip-text"
                >
                  一粟创作助手
                </p>
              </div>
              <nav class="flex flex-col flex-1">
                <ul role="list" class="flex flex-col flex-1 gap-y-7">
                  <li>
                    <ul role="list" class="-mx-2 space-y-1">
                      <li v-for="item in navigation" :key="item.name">
                        <a
                          :href="item.href"
                          class="flex p-2 text-sm font-semibold leading-6 rounded-md group gap-x-3"
                          :class="[
                            item.current
                              ? 'bg-gray-50 text-teal-600'
                              : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50',
                          ]"
                        >
                          <!-- <component
                            :is="item.icon"
                            class="w-4 h-4 shrink-0"
                            :class="[item.current ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600']"
                            aria-hidden="true"
                          /> -->
                          {{ item.name }}
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div class="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                    <ul role="list" class="mt-2 -mx-2 space-y-1">
                      <li v-for="team in teams" :key="team.name">
                        <a
                          :href="team.href"
                          class="flex p-2 text-sm font-semibold leading-6 rounded-md group gap-x-3"
                          :class="[
                            team.current
                              ? 'bg-gray-50 text-teal-600'
                              : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50',
                          ]"
                        >
                          <span
                            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                            :class="[
                              team.current
                                ? 'text-teal-600 border-teal-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-teal-600 group-hover:text-teal-600',
                            ]"
                            >{{ team.initial }}</span
                          >
                          <span class="truncate">{{ team.name }}</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="mt-auto">
                    <a
                      href="#"
                      class="flex p-2 -mx-2 text-sm font-semibold leading-6 text-gray-700 rounded-md group gap-x-3 hover:bg-gray-50 hover:text-teal-600"
                    >
                      <Cog6ToothIcon
                        class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-teal-600"
                        aria-hidden="true"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Static sidebar for desktop -->
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div class="flex flex-col px-6 pb-4 bg-white border-r border-gray-200 grow gap-y-2">
      <div class="flex items-center h-16 gap-2 -mx-1 shrink-0">
        <IconLogo class="w-auto h-8 text-teal-600 sm:h-8 sm:w-8" />
        <p
          class="text-lg font-black text-transparent sm:text-xl bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text"
        >
          一粟写作助手
        </p>
      </div>
      <nav class="flex flex-col flex-1">
        <ButtonNewChat />

        <ul role="list" class="flex flex-col flex-1 mt-4 -mx-2">
          <li class="overflow-y-auto h-[calc(100vh-15.5rem)]">
            <ul role="list" class="space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <a
                  :href="item.href"
                  class="flex p-2 text-sm font-semibold leading-6 rounded-md group gap-x-3"
                  :class="[
                    item.current ? 'bg-gray-50 text-teal-600' : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50',
                  ]"
                >
                  <component
                    :is="item.icon"
                    class="w-5 h-5 shrink-0"
                    :class="[item.current ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600']"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </a>
              </li>
              <li ref="loadBox" class="flex items-center justify-center w-full">
                <SvgIcon icon="svg-spinners:bars-scale-fade" class="w-5 h-5 text-teal-500 shrink-0" />
              </li>
            </ul>
          </li>
          <li class="flex items-center mt-auto">
            <ButtonPersonalCenter />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
