<script setup lang="ts">
import { AcademicCapIcon, LanguageIcon, NewspaperIcon } from '@heroicons/vue/20/solid'
import EnglishWritingImg from '@/assets/images/exam.png'

const features = [
  {
    name: '雅思作文批改，',
    description: '给分数还给建议',
    icon: LanguageIcon,
  },
  {
    name: '类似习题生成，',
    description: '错题就多多联系',
    icon: NewspaperIcon,
  },
  {
    name: '疑难答案详解，',
    description: '帮助你彻底搞懂',
    icon: AcademicCapIcon,
  },
]
</script>

<template>
  <div class="relative py-24 overflow-hidden bg-gray-900 isolate sm:py-32">
    <div class="mx-auto max-w-7xl md:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-7 lg:items-start">
        <div class="col-span-3 px-6 lg:px-0 lg:pt-4 lg:pr-4">
          <div class="max-w-2xl mx-auto lg:mx-0 lg:max-w-lg">
            <p class="mt-2 text-3xl font-bold tracking-tight text-teal-400 sm:text-4xl">助力备考</p>
            <p class="mt-6 text-lg leading-8 text-gray-400">帮您高效准备各类学科考试</p>
            <dl class="max-w-xl mt-10 space-y-8 text-base leading-7 text-gray-400 lg:max-w-none">
              <div v-for="feature in features" :key="feature.name" class="relative pl-9">
                <dt class="inline font-semibold text-white">
                  <component
                    :is="feature.icon"
                    class="absolute w-5 h-5 text-teal-400 top-1 left-1"
                    aria-hidden="true"
                  />
                  {{ feature.name }}
                </dt>

                <dd class="inline">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="col-span-4 sm:px-6 lg:px-0">
          <div class="max-w-2xl mx-auto sm:mx-0 sm:max-w-none">
            <img
              :src="EnglishWritingImg"
              alt="Product screenshot"
              class="bg-gray-300 sm:rounded-3xl ring-13 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
    <svg
      class="pointer-events-none absolute top-1/2 left-12 -z-10 h-[42.375rem] -translate-y-1/2 transform-gpu blur-3xl lg:top-auto lg:bottom-[-12rem] lg:translate-y-0"
      viewBox="0 0 1155 678"
      fill="none"
    >
      <path
        fill="url(#c0458c57-1330-459f-9d5c-f0d75c210466)"
        fill-opacity=".25"
        d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
      />
      <defs>
        <linearGradient
          id="c0458c57-1330-459f-9d5c-f0d75c210466"
          x1="1155.49"
          x2="-78.208"
          y1=".177"
          y2="474.645"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#21D3FF" />
          <stop offset="1" stop-color="#10FFF3" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>
