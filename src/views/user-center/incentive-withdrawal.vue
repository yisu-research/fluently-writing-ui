<script setup lang="ts">
import { toRefs } from 'vue'
import { NNumberAnimation, NStatistic } from 'naive-ui'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import QrCodeImg from '@/assets/images/qrcode.jpg'

const props = defineProps<{
  open: boolean
  amount: number
}>()

const emit = defineEmits(['close'])

const { open, amount } = toRefs(props)

const close = () => {
  emit('close')
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div class="flex flex-col items-center">
                <p>感谢您的支持与推广！</p>
                <p class="flex items-end">
                  <span>当前可提现奖励</span>
                  <NStatistic tabular-nums class="mx-1" style="--n-value-font-size: 20px">
                    <NNumberAnimation :from="0.0" :to="amount" :precision="2" active show-separator />
                  </NStatistic>
                  <span>&thinsp;元</span>
                </p>
                <div class="my-4 shadow-lg rainbow-container">
                  <img :src="QrCodeImg" alt="QR Code" />
                  <div class="rainbows">
                    <div class="rainbow"></div>
                    <div class="rainbow"></div>
                  </div>
                </div>
                <p>微信扫描上方二维码</p>
                <p>联系客服即可提现</p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
