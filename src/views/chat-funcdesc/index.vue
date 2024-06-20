<script setup lang="ts">
import { SvgIcon } from '@/components/common'

const title = '模型列表'

const titles = ['模型', '输入', '输出', '联网', '备注', '1积分额度']

const modelData: any[] = [
  {
    title: '大模型-3.5',
    input: '文本',
    output: '文本',
    network: 'hugeicons:cancel-circle-half-dot',
    stroke: 'blue',
    fill: 'none',
    note: '当前性价比最高的AI模型（对标ChaGPT3.5），适合一般的日常任务。',
    cost: ['输入20000 tokens', '输出 6667 tokens'],
  },
  {
    title: '大模型-4.0',
    input: '文本+图片',
    output: '文本',
    network: 'hugeicons:cancel-circle-half-dot',
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
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ title }}</h1>
      </div>
    </div>
    <div class="flow-root mt-8">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="item of titles"
                    :key="item"
                    scope="col"
                    class="py-3.5 first:pl-4 first:px-0 px-3 first:pr-3 text-left text-sm font-semibold text-gray-900 first:sm:pl-6"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="model in modelData" :key="model.title">
                  <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                    {{ model.title }}
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ model.input }}</td>
                  <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ model.output }}</td>
                  <td class="w-20 px-3 py-4 text-sm text-gray-500">
                    <SvgIcon :icon="model.network" class="w-4 h-4 text-red-500" />
                  </td>
                  <td class="w-16 px-3 py-4 text-sm text-gray-500">{{ model.note }}</td>
                  <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div v-for="item of model.cost" :key="item">
                      <span>{{ item }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
