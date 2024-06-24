import { createLocalStorage } from '../../../utils/storage/local';
<script setup lang="ts">
import { toRefs } from 'vue'
import { NModal } from 'naive-ui'
import QrCodeImg from '@/assets/images/qrcode.jpg'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['switchToEmail', 'closeModal'])

const switchToEmail = () => {
  emit('switchToEmail')
}

const closeModal = () => {
  emit('closeModal')
}

const { show } = toRefs(props)
</script>

<template>
  <NModal v-model:show="show" @mask-click="closeModal">
    <div class="min-w-full mx-auto max-w-7xl sm:min-w-0">
      <!-- 忘记密码-引导提示 -->
      <div class="p-6 mx-4 bg-white rounded-xl backdrop-blur-lg sm:mx-0">
        <div class="flex flex-col justify-center text-sm text-hight-class-gray-1 md:flex md:justify-between">
          <h1 class="mb-8 text-xl font-bold">忘记密码</h1>

          <div class="flex flex-col items-center justify-center gap-8 sm:flex-row sm:justify-start sm:items-start">
            <div class="sm:max-w-xs">
              <h2 class="mb-2 text-lg font-medium text-hight-class-gray-1">您可以通过以下方式找回密码：</h2>
              <div class="text-lg list-disc list-inside">
                <p class="mt-3 text-lg hover:text-teal-100" @click="switchToEmail">
                  <span>1. 若账号已绑定邮箱，请通过邮箱验证码登录</span>
                  <span aria-hidden="true"> &rarr;</span>
                </p>
                <p>2. 没有绑定邮箱？请通过二维码联系客服找回密码。</p>
              </div>
            </div>

            <div class="flex flex-col items-center justify-center">
              <img
                :src="QrCodeImg"
                alt="Product screenshot"
                class="p-1 my-8 sm:my-0 rounded-xl ring-8 ring-primary/50"
                width="200"
                height="200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </NModal>
</template>
