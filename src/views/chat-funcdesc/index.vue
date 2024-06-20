<script setup lang="ts">
const title = '模型列表'

const titleList = ['模型', '输入', '输出', '联网', '备注', '1积分额度']

const modelData: {
  title: string
  input: string
  output: string
  network: string
  stroke: string
  fill: string
  note: string
  cost: string[]
}[] = [
  {
    title: '大模型-3.5',
    input: '文本',
    output: '文本',
    network:
      'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z',
    stroke: 'blue',
    fill: 'none',
    note: '当前性价比最高的AI模型（对标ChaGPT3.5），适合一般的日常任务。',
    cost: ['输入20000 tokens', '输出 6667 tokens'],
  },
  {
    title: '大模型-4.0',
    input: '文本+图片',
    output: '文本',
    network:
      'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z',
    stroke: 'blue',
    fill: 'none',
    note: '当前地表最强的AI模型（对标GPT4-o），支持文本/图片的输入和文本输出，适合完成较复杂，对结果质量要求较高的任务。',
    cost: ['输入2000 tokens', '输入 4张图片 ', '输出 666 tokens'],
  },
  // {
  //     title: '大模型-联网',
  //     input: '文本',
  //     output: '文本',
  //     network: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z',
  //     stroke: 'green',
  //     fill: 'white',
  //     note: '当前地表最强的AI模型（对标GPT4-o），支持文本/图片的输入和文本输出，且联网，适合完成时效性更高，质量要求更高的任务。',
  //     cost: [
  //         '输入 500 tokens',
  //         '输出 500 tokens'
  //     ]
  // }
]
// const tips = ['GLM4: 0.1元 / 1K tokens', 'gpt-4o： 0.035 / 1K tokens，0.105/1K tokens']
</script>

<template>
  <!-- Table Section -->
  <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-8 mx-auto">
    <!-- Card -->
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div
            class="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700"
          >
            <!-- Header -->
            <div
              class="grid gap-3 px-6 py-4 border-b border-gray-200 md:flex md:justify-between md:items-center dark:border-neutral-700"
            >
              <div>
                <h2 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  {{ title }}
                </h2>
              </div>
            </div>
            <!-- End Header -->

            <!-- Table -->
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead class="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th v-for="(item, index) in titleList" :key="index" scope="col" class="px-6 py-3 text-start">
                    <span
                      class="inline-flex items-center text-xs font-semibold tracking-wide text-gray-800 uppercase group gap-x-2 dark:text-neutral-200"
                    >
                      {{ item }}
                    </span>
                  </th>
                  <th scope="col" class="px-6 py-3 text-end"></th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                <tr
                  v-for="item in modelData"
                  :key="item.title"
                  class="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                  <td class="w-[150px] min-w-[150px]">
                    <div class="relative z-10 block px-6 py-2">
                      <div class="block text-sm decoration-2 dark:text-white-500">{{ item.title }}</div>
                    </div>
                  </td>
                  <td class="w-[150px] min-w-[150px]">
                    <div class="relative z-10 block py-2">
                      <p class="inline-flex gap-1.5 py-1 px-[22px] font-medium dark:text-neutral-200">
                        {{ item.input }}
                      </p>
                    </div>
                  </td>
                  <td class="w-[100px] min-w-[100px]">
                    <div class="relative z-10 block py-2">
                      <p
                        class="inline-flex items-center gap-1.5 py-1 px-[22px] text-xs font-medium dark:text-neutral-200"
                      >
                        {{ item.output }}
                      </p>
                    </div>
                  </td>
                  <td class="w-[100px] min-w-[100px]">
                    <div class="relative z-10 block px-6 py-2">
                      <svg
                        class="items-center flex-shrink-0 text-gray-800 size-3 dark:text-neutral-200"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path :d="item.network" :stroke="item.stroke" :fill="item.fill" />
                      </svg>
                    </div>
                  </td>
                  <td class="h-px w-72 min-w-72">
                    <div class="relative z-10 block">
                      <p class="items-center gap-1.5 py-1 px-[22px] text-xs font-medium dark:text-neutral-200">
                        {{ item.note }}
                      </p>
                    </div>
                  </td>
                  <td class="h-px w-[320px] min-w-[320px]">
                    <div class="relative z-10 block pl-2">
                      <p
                        v-for="(line, index) in item.cost"
                        :key="index"
                        class="items-center gap-1.5 py-1 px-[18px] font-medium dark:text-neutral-200"
                      >
                        {{ line }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End Table -->

            <!-- Footer -->
            <!-- <div
              class="grid gap-3 px-6 py-4 border-t border-gray-200 md:flex md:justify-between md:items-center dark:border-neutral-700"
            >
              <div>
                <p v-for="(line, index) in tips" :key="index" class="text-sm text-gray-600 dark:text-neutral-400">
                  <span class="font-semibold text-gray-600 dark:text-neutral-200">{{ line }}</span>
                </p>
              </div>
            </div> -->
            <!-- End Footer -->
          </div>
        </div>
      </div>
    </div>
    <!-- End Card -->
  </div>
  <!-- End Table Section -->
</template>

<style scoped></style>
