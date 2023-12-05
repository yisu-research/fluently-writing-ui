<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItemRow, NInput, useMessage } from 'naive-ui'
import api from '@/api'
import { isEmail, isPassword } from '@/utils/is'
import YisuImg from '@/assets/svg/yisu.svg'
import { LogoName } from '@/components/common'
import NatureSvg from '@/assets/svg/rocket-boy-flatline.svg'
import { useAppStore, useAuthStore } from '@/store'

// app
const appStore = useAppStore()

const authStore = useAuthStore()
const router = useRouter()
const message = useMessage()

const loadLogin = ref(false)

const formUserRef = ref<FormInst | null>(null)
const formEmailRef = ref<FormInst | null>(null)

// isDark
const isDark = computed(() => appStore.isDarkTheme)

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
</script>

<template>
  <div class="relative bg-slate-100 w-full overflow-hidden h-[100dvh] isolate dark:bg-slate-900">
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg x="50%" y="-1" class="overflow-visible fill-gray-50 dark:fill-slate-800/20">
        <path
          d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
          stroke-width="0"
        />
      </svg>
      <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
    </svg>
    <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[-20rem]">
      <svg
        class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/3 rotate-[20deg] sm:left-[calc(50%-20rem)] sm:h-[62.375rem]"
        viewBox="0 0 1155 678"
      >
        <path
          fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
          fill-opacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop :stop-color="isDark ? '#05EF99' : '#2DD4BF'" />
            <stop offset="1" :stop-color="isDark ? '#993FF8' : '#CDF973'" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div
      class="flex flex-col items-center justify-center h-full max-w-md px-4 mx-auto lg:max-w-5xl sm:px-6 lg:px-8 backdrop-filter backdrop-blur-md"
    >
      <div
        class="flex flex-col justify-between w-full h-full my-4 overflow-hidden shadow-md bg-white/60 rounded-2xl sm:h-auto dark:bg-white/10"
      >
        <div class="px-4 sm:p-6 sm:flex sm:justify-center">
          <!-- 插画 -->
          <div
            class="hidden w-full py-8 bg-teal-400/10 sm:rounded-2xl ring-13 ring-white/10 dark:bg-transparent lg:flex lg:flex-1 lg:justify-center"
          >
            <img :src="NatureSvg" alt="Product screenshot" class="w-96" />
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
            <div class="flex flex-wrap items-center justify-center text-lg text-gray-800 dark:text-slate-200">
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
