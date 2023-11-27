<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItemRow, NInput, useMessage } from 'naive-ui'
import api from '@/api'
import { isEmail, isPassword } from '@/utils/is'
import YisuImg from '@/assets/svg/yisu.svg'
import { LogoName } from '@/components/common'
import NatureSvg from '@/assets/svg/nature.svg'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const router = useRouter()
const message = useMessage()

const showForgetModal = ref(false)
const loadLogin = ref(false)

const tabName = ref('signin-username')
const isContact = ref(false)

const formUserRef = ref<FormInst | null>(null)
const formEmailRef = ref<FormInst | null>(null)

const formUser = ref({
  username: '',
  password: '',
  login_type: 'username',
})

const formEmail = ref({
  email: '',
  code: '',
  login_type: 'email_code',
})

const rulesForUser = {
  username: {
    required: true,
    message: '请输入用户名或邮箱',
    trigger: 'blur',
  },
  password: {
    required: true,
    validator(rule: any, value: string) {
      if (!value) {
        return new Error('请输入密码')
      } else if (!isPassword(value)) {
        return new Error('密码应为 8~32 位，且包含数字或字母')
      }
      return true
    },
    trigger: 'blur',
  },
}

const rulesForEmail = {
  email: {
    required: true,
    validator(rule: any, value: string) {
      if (!value) {
        return new Error('请填写邮箱')
      } else if (!isEmail(value)) {
        return new Error('请填写正确的邮箱地址')
      }
      return true
    },
    trigger: 'blur',
  },
  code: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur',
  },
}

// const onSignupForUser = async () => {
//   formUserRef.value!.validate(async (err) => {
//     if (!err) {
//       loadLogin.value = true
//       try {
//         const res: any = await api.loginApi(formUser.value)
//         authStore.setToken(res.token)
//         router.push('/chat')
//         message.success('登录成功')
//       } catch (_err: any) {
//         console.error(_err)
//         message.error(`登录失败，${_err.error.message}`)
//       } finally {
//         setTimeout(() => {
//           loadLogin.value = false
//         }, 1000)
//       }
//     } else {
//       console.error(err)
//       message.error('请按要求填写账号信息')
//     }
//   })
// }

const onSignupForEmail = async () => {
  formEmailRef.value?.validate(async (err) => {
    if (!err) {
      loadLogin.value = true
      try {
        const res: any = await api.loginApi(formEmail.value)
        authStore.setToken(res.token)
        router.push('/chat')
        message.success('登录成功')
      } catch (_err: any) {
        console.error(_err)
        message.error(`登录失败，${_err.error.message}`)
      } finally {
        setTimeout(() => {
          loadLogin.value = false
        }, 1000)
      }
    } else {
      console.error(err)
      message.error('请按要求填写账号信息')
    }
  })
}

const loadEmailCode = ref(false)
const freezeEmailCode = ref(false)
const countDown = ref(60)

const handleSendEmailCode = async (email: string) => {
  if (!isEmail(email)) {
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

const handleForgotPassword = () => {
  showForgetModal.value = true
  isContact.value = false
}

const switchToEmail = () => {
  showForgetModal.value = false
  tabName.value = 'signin-email'
}
</script>

<template>
  <div></div>
  <div class="bg-slate-100 w-full overflow-hidden h-[100dvh]">
    <div class="flex flex-col items-center justify-center h-full max-w-md px-4 mx-auto lg:max-w-5xl sm:px-6 lg:px-8">
      <div
        class="flex flex-col justify-between w-full h-full my-4 overflow-hidden bg-white shadow-sm rounded-2xl sm:h-auto ring-slate-200 ring-1"
      >
        <div class="px-4 sm:p-6 sm:flex sm:justify-center">
          <!-- 插画 -->
          <div
            class="hidden w-full py-8 sm:rounded-xl ring-13 ring-white/10 bg-teal-50/60 lg:flex lg:flex-1 lg:justify-center"
          >
            <img :src="NatureSvg" alt="Product screenshot" class="mx-10 w-60" />
          </div>

          <!-- 注册表单 -->
          <div class="flex flex-col items-center justify-between flex-2 sm:w-96 lg:pl-6">
            <RouterLink to="/" class="mt-12 font-semibold leading-6 text-gray-900 scale-150">
              <LogoName name="一粟创作助手" />
            </RouterLink>

            <p class="my-8 text-lg font-medium text-teal-500">注册账号</p>
            <div class="w-full">
              <NForm ref="formUserRef" :model="formUser" :rules="rulesForUser" size="large">
                <NFormItemRow label="用户名" path="username">
                  <NInput v-model:value="formUser.username" placeholder="请输入用户名或邮箱" />
                </NFormItemRow>
                <NFormItemRow label="密码" path="password">
                  <NInput v-model:value="formUser.password" placeholder="请输入密码" type="password" />
                </NFormItemRow>
                <NFormItemRow label="邀请码 (选填)" path="invitationCode">
                  <NInput v-model:value="formUser.password" placeholder="请输入邀请码（可选）" />
                </NFormItemRow>
              </NForm>
              <NButton
                type="primary"
                block
                secondary
                strong
                class="mt-8"
                :loading="loadLogin"
                size="large"
                @click.prevent="onSignupForEmail"
              >
                注册
              </NButton>
              <div class="flex items-center justify-end my-2 sm:mb-0">
                <router-link to="/login"><NButton text class="">已有账号？去登录 </NButton></router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 封底 -->
        <div class="px-4 sm:px-6">
          <div class="py-4 border-t border-slate-900/5 lg:flex lg:justify-between lg:items-center">
            <div class="flex flex-wrap items-center justify-center text-lg text-gray-800">
              <img :src="YisuImg" width="28" class="mr-2" />
              <p class="font-bold">一粟科研</p>
            </div>
            <p class="mt-4 text-sm leading-6 text-center lg:mt-0 text-slate-500">
              © 2023 一粟科研 Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
