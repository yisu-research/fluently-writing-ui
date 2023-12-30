import { computed, ref } from 'vue'
import { type UploadCustomRequestOptions, useMessage } from 'naive-ui'
import api from '@/api'
import { getBase64 } from '@/utils/image'
import { useAuthStoreWithOut } from '@/store'

export function useImageUpload() {
  const message = useMessage()

  const authStore = useAuthStoreWithOut()

  const token = computed(() => authStore.getToken)

  const fileList = ref([])

  const fileName = ref('')

  const fileSize = ref('')

  const imageSrc = ref<string>('')

  const imgLoadingPercent = ref(0)

  const loadingState = ref<'loading' | 'success' | 'failed'>('loading')

  const loadingColors = {
    loading: 'bg-sky-400',
    success: 'bg-green-400',
    failed: 'bg-rose-400',
  }

  const progressBarStyle = computed(() => {
    return {
      width: `${imgLoadingPercent.value * 100}%`,
    }
  })

  function onFileListChange() {
    if (fileList.value.length > 1) {
      fileList.value.shift()
    }
  }

  function remoteImage() {
    fileList.value = []
    fileName.value = ''
    fileSize.value = ''
    imageSrc.value = ''
    imgLoadingPercent.value = 0
    loadingState.value = 'loading'
  }

  const customRequest = async ({ file, withCredentials }: UploadCustomRequestOptions) => {
    loadingState.value = 'loading'
    const formData = new FormData()

    fileName.value = file.name

    fileSize.value = Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(file.file!.size)

    imageSrc.value = await getBase64(file.file as File)

    formData.append('file', file.file as File, file.name)

    api
      .uploadFileApi(formData, {
        withCredentials,
        onUploadProgress: async (progressEvent: any) => {
          imgLoadingPercent.value = progressEvent.progress
        },
      })
      .then(({ json }: any) => {
        loadingState.value = 'success'
        message.success(JSON.stringify(json))
      })
      .catch((error) => {
        loadingState.value = 'failed'
        message.success(error.message)
      })
  }

  return {
    token,
    fileList,
    fileName,
    fileSize,
    imageSrc,
    imgLoadingPercent,
    loadingState,
    loadingColors,
    progressBarStyle,
    onFileListChange,
    remoteImage,
    customRequest,
  }
}
