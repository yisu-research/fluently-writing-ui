<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItemRow,
  NIcon,
  NInput,
  NModal,
  NTabPane,
  NTabs,
  useMessage,
} from 'naive-ui'
import api from '@/api'
import { isEmail, isPassword } from '@/utils/is'
import QrCodeImg from '@/assets/images/qrcode.jpg'
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

const onSignupForUser = async () => {
  formUserRef.value!.validate(async (err) => {
    if (!err) {
      loadLogin.value = true
      try {
        const res: any = await api.loginApi(formUser.value)
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
    <div class="flex flex-col items-center justify-center h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div
        class="flex flex-col justify-between w-full h-full my-4 overflow-hidden bg-white rounded-lg shadow-sm sm:h-auto ring-slate-200 ring-1"
      >
        <div class="px-4 sm:p-6 sm:flex sm:justify-center">
          <!-- 插画 -->
          <div
            class="hidden w-full py-8 sm:rounded-sm ring-13 ring-white/10 bg-teal-50 lg:flex lg:flex-1 lg:justify-center"
          >
            <img :src="NatureSvg" alt="Product screenshot" class="mx-10 w-80" />
          </div>

          <!-- 登录表单 -->
          <div class="flex flex-col items-center justify-between sm:px-6 sm:w-96 flex-2">
            <RouterLink to="/" class="mt-8 font-semibold leading-6 text-gray-900 scale-150">
              <LogoName />
            </RouterLink>
            <div class="w-full mt-8">
              <NTabs v-model:value="tabName" size="large" justify-content="center" animated>
                <NTabPane name="signin-username" tab="密码登录">
                  <NForm ref="formUserRef" :model="formUser" :rules="rulesForUser">
                    <NFormItemRow label="用户名" path="username">
                      <NInput v-model:value="formUser.username" placeholder="请输入用户名或邮箱" />
                    </NFormItemRow>
                    <NFormItemRow label="密码" path="password">
                      <NInput v-model:value="formUser.password" placeholder="请输入密码" type="password" />
                    </NFormItemRow>
                    <div class="flex flex-row-reverse mb-8">
                      <NButton text @click="handleForgotPassword">忘记密码？</NButton>
                    </div>
                  </NForm>
                  <NButton
                    class="mt-8"
                    type="primary"
                    :loading="loadLogin"
                    block
                    secondary
                    strong
                    @click.prevent="onSignupForUser"
                  >
                    登录
                  </NButton>
                </NTabPane>
                <NTabPane name="signin-email" tab="验证码登录">
                  <NForm ref="formEmailRef" :model="formEmail" :rules="rulesForEmail">
                    <NFormItemRow label="邮箱" path="email">
                      <NInput v-model:value="formEmail.email" placeholder="请输入邮箱地址" />
                    </NFormItemRow>
                    <NFormItemRow label="验证码" path="code">
                      <NInput v-model:value="formEmail.code" placeholder="请输入验证码" class="mr-2" />
                      <NButton
                        strong
                        secondary
                        type="primary"
                        :disabled="freezeEmailCode"
                        :loading="loadEmailCode"
                        @click="handleSendEmailCode(formEmail.email)"
                      >
                        <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                        <span v-else>获取验证码</span>
                      </NButton>
                    </NFormItemRow>
                  </NForm>

                  <NButton
                    type="primary"
                    block
                    secondary
                    strong
                    class="mt-8"
                    :loading="loadLogin"
                    @click.prevent="onSignupForEmail"
                  >
                    登录
                  </NButton>
                </NTabPane>
              </NTabs>
              <div class="flex items-center justify-end my-2 sm:mb-0">
                <router-link to="/signup"><NButton text class="">没有账号？去注册 </NButton></router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 忘记密码 -->
        <NModal v-model:show="showForgetModal">
          <NCard style="width: 600px" title="忘记密码" :bordered="false" size="huge" preset="dialog" aria-modal="true">
            <template #header-extra>
              <NButton strong secondary class="text-md" @click="showForgetModal = false">
                <icon-ic:sharp-close />
              </NButton>
            </template>
            <div v-if="isContact">
              <div class="flex flex-col items-center">
                <p class="text-lg">请您联系客服找回密码</p>
                <img
                  :src="QrCodeImg"
                  alt="Product screenshot"
                  class="p-1 my-6 rounded-xl ring-6 ring-teal-500"
                  width="200"
                  height="200"
                />
              </div>
              <div class="mt-4 text-right">
                <NButton text @click="isContact = false">
                  <span>已绑定邮箱？用验证码登录</span>
                  <NIcon size="18">
                    <icon-ic:baseline-keyboard-double-arrow-right />
                  </NIcon>
                </NButton>
              </div>
            </div>
            <div v-else>
              <NAlert title="温馨提示" type="info" :bordered="false">
                <template #icon>
                  <NIcon size="20">
                    <icon-material-symbols:alternate-email />
                  </NIcon>
                </template>
                <p>若账号已绑定邮箱，请通过邮箱验证码登录。</p>
                <p>登录成功后，请及时更改密码。</p>
              </NAlert>
              <NButton type="primary" block class="mt-8" @click="switchToEmail">邮箱验证码登录</NButton>
              <div class="mt-6 text-right">
                <NButton text @click="isContact = true">
                  <span>没有绑定邮箱？去联系客服</span>
                  <NIcon size="18">
                    <icon-ic:baseline-keyboard-double-arrow-right />
                  </NIcon>
                </NButton>
              </div>
            </div>
          </NCard>
        </NModal>

        <!-- 封底 -->
        <div class="px-4 sm:px-6">
          <div class="py-4 border-t border-slate-900/5">
            <div class="flex flex-wrap items-center justify-center">
              <img :src="YisuImg" width="36" class="mr-2" />
              <p class="font-bold">一粟科研</p>
            </div>
            <p class="mt-5 text-sm leading-6 text-center text-slate-500">© 2023 一粟科研 Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
