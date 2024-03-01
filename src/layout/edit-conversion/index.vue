<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useMessage } from 'naive-ui'
import { useDebounceFn } from '@vueuse/core'
import { SvgIcon } from '@/components/common'
import { useChatStoreWithOut } from '@/store'

const props = defineProps<{
  id: number
}>()

const chatStore = useChatStoreWithOut()

const isOpen = ref(false)

const editForm = ref({
  name: '',
})

const loading = ref(false)

const message = useMessage()

const conversation = chatStore.conversations.find((item) => item.id === props.id)

function closeModal() {
  isOpen.value = false
}
function openModal() {
  editForm.value.name = conversation?.name || ''
  isOpen.value = true
}

const saveName = useDebounceFn(async () => {
  if (!editForm.value.name) {
    message.error('请输入对话名称')
    return
  }
  loading.value = true
  const res = await chatStore.updateConversationById(props.id, editForm.value)
  if (res) {
    message.success('修改成功')
    closeModal()
  } else {
    message.error('修改失败')
  }
  loading.value = false
}, 300)

async function deleteConversation() {
  loading.value = true
  const res = await chatStore.deleteConversationById(props.id)
  if (res) {
    message.success('删除成功')
    closeModal()
  } else {
    message.error('删除失败')
  }
  loading.value = false
}
</script>

<template>
  <div>
    <SvgIcon
      icon="solar:pen-new-square-linear"
      class="w-6 h-6 p-1 rounded-md hover:text-teal-600 dark:text-slate-3 00 hover:bg-teal-600/10 text-slate-600 shrink-0"
      @click.stop="openModal"
    />
  </div>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl backdrop-blur-md bg-white/90 rounded-2xl"
            >
              <div class="">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> 编辑对话 </DialogTitle>
                  <button
                    type="button"
                    class="absolute inline-flex items-center justify-center w-10 h-10 text-gray-400 bg-white rounded-full top-4 right-4 item hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                    @click="closeModal"
                  >
                    <span class="sr-only">Close</span>
                    <SvgIcon icon="ph:x-bold" class="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div class="my-8">
                  <label for="email" class="block text-sm font-medium leading-6 text-gray-900">对话名称</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input
                      id="name"
                      v-model="editForm.name"
                      type="text"
                      name="name"
                      class="block w-full py-2 text-gray-900 bg-transparent border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                      placeholder="对话名称"
                    />
                    <button
                      type="button"
                      class="inline-flex justify-center w-1/4 px-4 py-2 text-sm font-medium text-teal-600 border border-transparent rounded-md bg-teal-600/10 hover:bg-teal-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="saveName"
                    >
                      保存
                    </button>
                  </div>
                </div>

                <Disclosure v-slot="{ open }">
                  <DisclosureButton
                    :class="[open ? 'rounded-b-none' : 'rounded-b-md']"
                    class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium border border-dashed rounded-md border-rose-400 text-rose-500 hover:bg-rose-200/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  >
                    删除对话
                  </DisclosureButton>
                  <DisclosurePanel
                    class="px-4 pt-4 pb-2 text-sm text-gray-500 border-t-0 rounded-md rounded-t-none shadow-sm border-rose-600/10 bg-rose-100/10"
                  >
                    <p class="pb-4 font-bold text-slate-800">对话删除后将无法找回,请谨慎操作。确定删除对话？</p>
                    <button
                      type="button"
                      class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md bg-rose-300/40 border-rose-600 hover:bg-red-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      @click="deleteConversation"
                    >
                      确定
                    </button>
                  </DisclosurePanel>
                </Disclosure>
              </div>
              <div
                v-show="loading"
                class="absolute top-0 left-0 flex items-center justify-center w-full h-full ite bg-white/90"
              >
                <SvgIcon icon="svg-spinners:bars-scale-fade" class="w-5 h-5 text-teal-500" aria-hidden="true" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
