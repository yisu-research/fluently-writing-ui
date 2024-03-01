<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { NAlert, NButton, NForm, NFormItemRow, NInput, useMessage } from 'naive-ui'
import { isValidEmail } from '@/utils/format'
import { useUserStore } from '@/store'
import api from '@/api'

const props = defineProps<{
  open: boolean
  isEmailBind: boolean
}>()

const emit = defineEmits(['close'])

const { open, isEmailBind } = toRefs(props)

const userStore = useUserStore()

const close = () => {
  emit('close')
}

const refEmailBind = ref<any>(null)

const modelEmailBind = ref({
  email: null,
  code: null,
})
const ruleEmailBind = {
  email: [
    {
      required: true,
      validator(rule: any, value: string) {
        if (!value) {
          return new Error('请输入邮箱地址')
        } else if (!isValidEmail(value)) {
          return new Error('邮箱地址不合法')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
}
const loadEmailBind = ref(false)
// bind email
const showEmailModal = ref(false)

const message = useMessage()

const handleEmailBindClick = (e: any) => {
  e.preventDefault()
  const action = userStore.getEmail ? '更改' : '绑定'
  refEmailBind.value?.validate(async (err: any) => {
    if (!err) {
      loadEmailBind.value = true
      try {
        await api.bindEmailApi({ email: modelEmailBind.value.email, code: modelEmailBind.value.code })
        message.success(`邮箱${action}成功`)
        await userStore.fetchProfile()
      } catch (err: any) {
        console.error(err)
        message.success(`邮箱${action}失败，${err.error.message}`)
        close()
      } finally {
        modelEmailBind.value = {
          email: null,
          code: null,
        }
        loadEmailBind.value = false
      }
    } else {
      console.error(err)
      message.error('请按提示正确填写内容')
    }
    showEmailModal.value = false
  })
}

// send verify code
const loadEmailCode = ref(false)
const freezeEmailCode = ref(false)
const countDown = ref(60)

const handleSendEmailCode = async (email: string) => {
  if (!isValidEmail(email)) {
    message.error('邮箱地址不合法')
    return
  }
  loadEmailCode.value = true
  try {
    await api.sendCodeApi({ category: 'email', email })
    message.success('验证码已发送，请注意查收')
    freezeEmailCode.value = true
    const timer = setInterval(() => {
      countDown.value--
      if (countDown.value === 0) {
        clearInterval(timer)
        freezeEmailCode.value = false
        countDown.value = 30
      }
    }, 1000)
  } catch (err: any) {
    console.error(err)
    message.error(`验证码发送失败，${err.error.message}`)
  } finally {
    loadEmailCode.value = false
  }
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
              <NAlert v-if="!isEmailBind" title="安全提示" type="warning" class="mb-6">
                <p>为了保障您的账号安全，请您及时绑定邮箱！</p>
                <p>现在绑定还能获赠&thinsp;10&thinsp;次体验机会！</p>
              </NAlert>
              <NForm ref="refEmailBind" :model="modelEmailBind" :rules="ruleEmailBind">
                <NFormItemRow label="邮箱地址" path="email">
                  <NInput v-model:value="modelEmailBind.email" placeholder="请输入邮箱地址" />
                </NFormItemRow>
                <NFormItemRow label="验证码" path="code">
                  <NInput
                    v-model:value="modelEmailBind.code"
                    placeholder="请输入验证码"
                    :disabled="!modelEmailBind.email"
                  />
                  <NButton
                    type="primary"
                    dashed
                    class="ml-2"
                    :disabled="!modelEmailBind.email || freezeEmailCode"
                    :loading="loadEmailCode"
                    @click="handleSendEmailCode(modelEmailBind.email ?? '')"
                  >
                    <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                    <span v-else>获取验证码</span>
                  </NButton>
                </NFormItemRow>
              </NForm>
              <div class="flex justify-end">
                <NButton
                  :disabled="!modelEmailBind.email || !modelEmailBind.code"
                  type="primary"
                  :loading="loadEmailBind"
                  @click="handleEmailBindClick"
                >
                  {{ isEmailBind ? '更改' : '绑定' }}
                </NButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
