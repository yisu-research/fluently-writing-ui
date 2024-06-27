<script setup lang="ts">
import { SvgIcon } from '@/components/common'
const title = '模型说明'

const titles = ['模型', '输入', '输出', '备注', '1积分额度']

const modelData: any[] = [
  {
    title: '大模型-基础',
    input: '文本',
    icon: 'hugeicons:group-items',
    output: '文本',
    network: 'hugeicons:cancel-circle-half-dot',
    stroke: 'blue',
    fill: 'none',
    note: '当前性价比最高的AI模型（对标ChaGPT3.5），适合一般的日常任务。',
    cost: ['输入20000 tokens', '输出 6667 tokens'],
  },
  {
    title: '大模型-高级',
    input: '文本+图片',
    icon: 'hugeicons:group-layers',
    output: '文本',
    network: 'hugeicons:cancel-circle-half-dot',
    stroke: 'blue',
    fill: 'none',
    note: '当前地表最强的AI模型（对标GPT4-o），支持文本/图片的输入和文本输出，适合完成较复杂，对结果质量要求较高的任务。',
    cost: ['输入2000 tokens', '输入 4张图片 ', '输出 666 tokens'],
  },
]
</script>

<template>
  <div class="h-screen bg-slate-100/80">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="hidden mt-16 bg-white border lg:mt-0 border-slate-200 rounded-xl sm:block">
        <div class="sm:flex sm:items-center min-h-16">
          <div class="px-4 sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-gray-900">{{ title }}</h1>
          </div>
        </div>
        <div class="flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow sm:rounded-b-xl">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-100">
                    <tr>
                      <th
                        v-for="(item, index) of titles"
                        :key="item"
                        scope="col"
                        :class="{
                          'w-4': index === 0,
                          'w-3': index === 1 || index === 2,
                          'w-6': index === 3,
                          'w-20': index === 4,
                        }"
                        class="py-3.5 first:pl-4 first:px-0 px-3 first:pr-3 text-left text-sm font-semibold text-gray-900 first:sm:pl-6"
                      >
                        {{ item }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="model in modelData" :key="model.title">
                      <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-8 whitespace-nowrap sm:pl-6">
                        {{ model.title }}
                      </td>
                      <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap max-w-2">{{ model.input }}</td>
                      <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap max-w-2">{{ model.output }}</td>
                      <td class="w-20 px-3 py-4 text-sm text-gray-500">{{ model.note }}</td>
                      <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap max-w-8">
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
      <div class="mt-16 bg-white border sm:hidden rounded-xl border-slate-200">
        <div class="flex items-center min-h-16">
          <div class="flex-auto px-4">
            <h1 class="text-base font-semibold leading-6 text-gray-900">{{ title }}</h1>
          </div>
        </div>
        <div class="flex flex-col px-4 pb-4 gap-y-4">
          <div v-for="model of modelData" :key="model.title">
            <div class="rounded-xl bg-primary-4/5">
              <div class="flex justify-between p-4 items center">
                <div class="flex items-center gap-2 text-lg font-bold text-hight-class-gray">
                  <SvgIcon :icon="model.icon" class="w-5 h-5 shrink-0" :stroke="model.stroke" :fill="model.fill" />
                  <p>{{ model.title }}</p>
                </div>
              </div>
              <div class="flex justify-between px-4">
                <div class="flex-1">
                  <span class="text-sm font-semibold text-gray-900">输入：</span>
                  <span class="text-sm text-gray-500">{{ model.input }}</span>
                </div>
                <div class="flex-1">
                  <span class="text-sm font-semibold text-gray-900">输出：</span>
                  <span class="text-sm text-gray-500">{{ model.output }}</span>
                </div>
              </div>
              <div class="flex justify-between p-4">
                <div class="flex-1">
                  <span class="text-sm font-semibold text-gray-900">1积分额度</span>
                </div>
                <div class="flex-1">
                  <div v-for="item of model.cost" :key="item">{{ item }}</div>
                </div>
              </div>
              <div class="p-4 border-t">
                <span class="font-bold text-hight-class-gray-1">备注：</span>
                <span class="text-hight-class-gray-1">{{ model.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
