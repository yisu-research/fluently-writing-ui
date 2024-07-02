<script setup lang="ts">
import { useRouter } from 'vue-router'

const pageTitle = [
    '创建时间',
    '问卷名称',
    '问卷状态',    
    '操作'
]


// testdata
const questionnaires = [
    {
        name: '问卷1',
        date: '28 Dec, 12:12',
        state: 'finish',
    }
]

const router = useRouter()
function createQuestionnaire() {
    router.push('/questionnaire-create')
}

</script>

<template>

  <div>
    <!-- Table Section -->
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <!-- Card -->
        <div class="flex flex-col">
            <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                <!-- Header -->
                <div class="px-6 py-4 grid gap-3 md:flex md:justify-center md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                    <div class="inline-flex gap-x-2">
                        <button class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" @click="createQuestionnaire()">
                            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            新建问卷
                        </button>
                    </div>
                    </div>
                </div>
                <!-- End Header -->

                <!-- Table -->
                <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead class="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                        <th scope="col" 
                            class="py-3.5 first:pl-4 first:px-0 px-3 first:pr-3 text-left text-sm font-semibold text-gray-900 first:sm:pl-6t" 
                            v-for="(item,index) of pageTitle" 
                            :key="index"
                            >
                            {{ item }}
                        </th>
                    </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                    <tr v-for="item of questionnaires"
                        :key="item.date">
                        <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-8 whitespace-nowrap sm:pl-4">
                            {{ item.date }}
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap max-w-2">{{ item.name }}</td>
                        <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap max-w-2">{{ item.state }}</td>
                        <td class="w-20 px-3 py-4 text-sm text-gray-500">查看</td>
                    </tr>
                    </tbody>
                </table>
                <!-- End Table -->
                </div>
            </div>
            </div>
        </div>
    <!-- End Card -->
    </div>
    <!-- End Table Section -->
  </div>
</template>

<style scoped></style>