<script setup lang="ts">
import QrCodeImg from '@/assets/images/qrcode.jpg'
import bgImage from '@/assets/images/background-newsletter.488a0204.jpg'
import { SvgIcon } from '@/components/common'
</script>

<template>
  <div class="relative pb-8 mx-auto overflow-hidden sm:mb-32 max-w-7xl md:px-6 lg:px-8 bg-indigo-50 sm:rounded-3xl">
    <img
      alt=""
      loading="lazy"
      width="919"
      height="1351"
      decoding="async"
      data-nimg="1"
      class="absolute left-1/2 top-0 translate-x-[-10%] translate-y-[-45%] lg:translate-x-[-32%]"
      style="color: transparent"
      :src="bgImage"
    />
    <div
      class="absolute top-0 left-0 z-40 w-full h-full dark:bg-slate-600 dark:bg-opacity-60 -backdrop-hue-rotate-60"
    ></div>
    <div class="relative z-40 flex flex-col mx-auto sm:flex-row sm:items-center sm:justify-between max-w-7xl">
      <div class="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:py-24 lg:px-8">
        <div class="max-w-xl mx-auto lg:mx-0 lg:max-w-lg">
          <h2 class="text-3xl font-bold tracking-tight text-teal-700 dark:text-slate-50">联系我们</h2>
          <p class="mt-6 text-lg font-bold leading-8 text-teal-700 dark:text-slate-200">
            走进智能创作新时代，与我们一同完善一粟创作助手
          </p>
          <dl class="mt-10 space-y-4 text-base font-bold leading-7 text-teal-700 dark:text-slate-300">
            <div class="flex items-center gap-x-4">
              <dt class="flex-none">
                <SvgIcon icon="solar:call-chat-rounded-bold-duotone" class="w-5 h-5 text-teal-500" aria-hidden="true" />
              </dt>
              <dd>遇到任何创作问题？随时向我们反馈！</dd>
            </div>
            <div class="flex items-center gap-x-4">
              <dt class="flex-none">
                <SvgIcon icon="solar:square-share-line-bold-duotone" class="w-5 h-5 text-teal-500" aria-hidden="true" />
              </dt>
              <dd>对我们的服务感到满意？欢迎分享给朋友们！</dd>
            </div>
            <div class="flex items-center gap-x-4">
              <dt class="flex-none">
                <SvgIcon icon="solar:gift-bold-duotone" class="w-5 h-5 text-teal-500" aria-hidden="true" />
              </dt>
              <dd>想进一步支持我们？更多优惠与专属福利等你来！</dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="flex items-center justify-center w-48 h-48 mx-auto sm:w-72 lg:px-8 sm:h-72">
        <img
          :src="QrCodeImg"
          alt="Product screenshot"
          class="w-48 h-48 p-2 bg-white rounded-xl sm:rounded-2xl ring-8 ring-teal-500/[0.5]"
        />
      </div>
    </div>
  </div>
</template>
