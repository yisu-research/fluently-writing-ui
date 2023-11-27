<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItemRow, NInput, NModal, NTabPane, NTabs, useMessage } from 'naive-ui'
import api from '@/api'
import { isEmail, isPassword } from '@/utils/is'
import YisuImg from '@/assets/svg/yisu.svg'
import { LogoName, SvgIcon } from '@/components/common'
import NatureSvg from '@/assets/svg/nature.svg'
import { useAuthStore } from '@/store'
import QrCodeImg from '@/assets/images/qrcode.jpg'

const router = useRouter()

const authStore = useAuthStore()

const message = useMessage()

const showForgetModal = ref(false)

const loadLogin = ref(false)

const tabName = ref('loginByPassword')

const isContact = ref(false)

const formPasswordRef = ref<FormInst | null>(null)

const formCodeRef = ref<FormInst | null>(null)

const formPassword = ref({
  username: '',
  password: '',
  login_type: 'username',
})

const formCode = ref({
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

const onLoginWithPassword = async () => {
  formPasswordRef.value!.validate(async (err) => {
    if (!err) {
      loadLogin.value = true
      try {
        const res: any = await api.loginApi(formPassword.value)
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

const onLoginWithCode = async () => {
  formCodeRef.value?.validate(async (err) => {
    if (!err) {
      loadLogin.value = true
      try {
        const res: any = await api.loginApi(formCode.value)
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
  tabName.value = 'loginByCode'
}

const handleLogin = () => {
  if (tabName.value === 'loginByPassword') {
    onLoginWithPassword()
  } else {
    onLoginWithCode()
  }
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

          <!-- 登录表单 -->
          <div class="flex flex-col items-center justify-between flex-2 sm:w-96 lg:pl-6">
            <!-- title -->
            <RouterLink to="/" class="mt-12 font-semibold leading-6 text-gray-900 scale-150">
              <LogoName name="一粟创作助手" />
            </RouterLink>

            <!-- form -->
            <div class="w-full mt-8">
              <NTabs v-model:value="tabName" size="large" justify-content="center" animated>
                <NTabPane name="loginByPassword" tab="密码登录">
                  <NForm ref="formPasswordRef" :model="formPassword" :rules="rulesForUser" size="large">
                    <NFormItemRow label="用户名" path="username">
                      <NInput v-model:value="formPassword.username" placeholder="请输入用户名或邮箱" />
                    </NFormItemRow>
                    <NFormItemRow label="密码" path="password">
                      <NInput v-model:value="formPassword.password" placeholder="请输入密码" type="password" />
                    </NFormItemRow>
                  </NForm>
                </NTabPane>
                <NTabPane name="loginByCode" tab="验证码登录">
                  <NForm ref="formCodeRed" :model="formCode" :rules="rulesForEmail" size="large">
                    <NFormItemRow label="邮箱" path="email">
                      <NInput v-model:value="formCode.email" placeholder="请输入邮箱地址" />
                    </NFormItemRow>
                    <NFormItemRow label="验证码" path="code">
                      <NInput v-model:value="formCode.code" placeholder="请输入验证码" class="mr-2" />
                      <NButton
                        strong
                        secondary
                        type="primary"
                        :disabled="freezeEmailCode"
                        :loading="loadEmailCode"
                        @click="handleSendEmailCode(formCode.email)"
                      >
                        <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                        <span v-else>获取验证码</span>
                      </NButton>
                    </NFormItemRow>
                  </NForm>
                </NTabPane>
              </NTabs>
              <NButton
                type="primary"
                block
                secondary
                strong
                class="mt-8"
                :loading="loadLogin"
                size="large"
                @click.prevent="handleLogin"
              >
                登录
              </NButton>
              <div class="flex items-center justify-between my-2 sm:mb-0">
                <NButton text @click="handleForgotPassword">忘记密码？</NButton>
                <router-link to="/register"><NButton text class="">没有账号？去注册 </NButton></router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 忘记密码 -->
        <NModal v-model:show="showForgetModal">
          <div class="max-w-3xl min-w-full mx-4 sm:min-w-0 sm:w-96 sm:mx-0">
            <!-- 忘记密码-引导提示 -->
            <div v-if="!isContact" class="p-4 mx-4 rounded-xl bg-teal-50 sm:mx-0">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-2">
                  <SvgIcon icon="solar:shield-warning-broken" class="w-5 h-5 text-teal-400" />
                </div>
                <div class="flex flex-col items-start text-sm text-teal-700 item md:flex md:justify-between">
                  <p>若账号已绑定邮箱，请通过邮箱验证码登录。</p>
                  <p>登录成功后，请及时更改密码。</p>
                  <NButton text @click="switchToEmail">
                    <p class="mt-3 text-sm font-medium text-teal-700 whitespace-nowrap hover:text-teal-600">
                      邮箱验证码登录
                      <span aria-hidden="true"> &rarr;</span>
                    </p>
                  </NButton>
                  <NButton text @click="isContact = true">
                    <p class="mt-3 text-sm font-medium text-teal-700 whitespace-nowrap hover:text-teal-600">
                      <span>没有绑定邮箱？去联系客服</span>
                      <span aria-hidden="true"> &rarr;</span>
                    </p>
                  </NButton>
                </div>
              </div>
            </div>

            <div v-else class="p-4 mx-4 rounded-xl bg-teal-50 sm:mx-0">
              <div class="flex flex-col justify-center text-sm text-teal-700 md:flex md:justify-between">
                <div class="flex items-center justify-start gap-2 text-lg font-medium">
                  <SvgIcon icon="solar:call-chat-broken" />
                  <p>请您联系客服找回密码</p>
                </div>
                <div class="flex flex-col items-center justify-center">
                  <img
                    :src="QrCodeImg"
                    alt="Product screenshot"
                    class="p-1 my-8 rounded-xl ring-8 ring-teal-500/50"
                    width="200"
                    height="200"
                  />
                </div>
                <div class="flex justify-end">
                  <NButton text @click="switchToEmail">
                    <p class="mt-3 text-sm font-medium text-teal-700 whitespace-nowrap hover:text-teal-600">
                      <span>已绑定邮箱？去登录</span>
                      <span aria-hidden="true"> &rarr;</span>
                    </p>
                  </NButton>
                </div>
              </div>
            </div>
          </div>
        </NModal>

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
