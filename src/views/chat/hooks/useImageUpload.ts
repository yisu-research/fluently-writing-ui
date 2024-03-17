import { computed, ref } from 'vue'
import { type UploadCustomRequestOptions, useMessage } from 'naive-ui'
import { compress } from 'image-conversion'
import type { FileInfo } from 'naive-ui/es/upload/src/interface'
import api from '@/api'
import { getBase64 } from '@/utils/image'

export function useImageUpload() {
  const message = useMessage()

  const fileList = ref<FileInfo[]>([])

  const fileName = ref('')

  const fileSize = ref('')

  const imageSrc = ref<string>('')

  const imageUrl = ref('')

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
      .then((res: any) => {
        // imageUrl.value = res.url.replace('https', 'http').replace('.com', '.com:3001')
        imageUrl.value = res.url
        loadingState.value = 'success'
        message.success('上传成功')
      })
      .catch((error) => {
        loadingState.value = 'failed'
        message.success(error.message)
      })
  }

  function getImgPx(img: string): Promise<{ width: number; height: number }> {
    const image = new Image()
    image.src = img
    return new Promise((resolve) => {
      image.onload = () => {
        const width = image.width
        const height = image.height
        resolve({ width, height })
      }
    })
  }

  async function beforeUpload(data: any) {
    if (
      data.file.file?.type === 'image/png' ||
      data.file.file?.type === 'image/jpeg' ||
      data.file.file?.type === 'image/jpg' ||
      data.file.file?.type === 'image/svg+xml'
    ) {
      const img = await getBase64(data.file.file)
      const { width, height } = await getImgPx(img)
      if (width > 512 || height > 512) {
        const x = width / 512
        const y = height / 512
        let w = 0
        let h = 0
        if (x > y) {
          w = 512
          h = height / x
        } else {
          w = width / y
          h = 512
        }
        const result = await compress(data.file.file, { quality: 0.8, width: w, height: h })
        const imgFile = new File([result], data.file.file.name, { type: data.file.file.type })
        data.file.file = imgFile
      }
      return true
    }

    message.error('只能上传png,jpg,jpeg格式的图片')
    return false
  }

  return {
    fileList,
    fileName,
    fileSize,
    imageSrc,
    imageUrl,
    imgLoadingPercent,
    loadingState,
    loadingColors,
    progressBarStyle,
    onFileListChange,
    remoteImage,
    customRequest,
    beforeUpload,
  }
}
