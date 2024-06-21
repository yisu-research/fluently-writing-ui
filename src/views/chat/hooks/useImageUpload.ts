import { computed, ref } from 'vue'
import { type UploadCustomRequestOptions, useMessage } from 'naive-ui'
import { compress } from 'image-conversion'
import type { FileInfo } from 'naive-ui/es/upload/src/interface'
import api from '@/api'
import { getBase64 } from '@/utils/image'

// 扩展 FileInfo 类型
export interface ImageInfo extends FileInfo {
  size: string | number
  src?: string
  state?: 'loading' | 'success' | 'failed'
}

export function useImageUpload() {
  const message = useMessage()

  const fileList = ref<ImageInfo[]>([])

  const images = ref<any[]>([])

  const fileName = ref('')

  const fileSize = ref('')

  const imageSrc = ref<string>('')

  const imageUrl = ref('')

  const imgLoadingPercent = ref(0)

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

  function onFileListChange() {}

  function removeImage(id: string) {
    fileList.value = fileList.value.filter((item) => item.id !== id)
    images.value = images.value.filter((item) => item.id !== id)
  }

  // 清空图片
  function clearImages() {
    fileList.value = []
    images.value = []
  }

  function uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file, file.name)
    api
      .uploadFileApi(formData, {})
      .then((res: any) => {
        // imageUrl.value = res.url.replace('https', 'http').replace('.com', '.com:3001')
        images.value[images.value.length - 1].url = res.url
        images.value[images.value.length - 1].state = 'success'
        message.success('上传成功')
      })
      .catch((error) => {
        images.value[images.value.length - 1].state = 'failed'
        message.success(error.message)
      })
  }

  const customRequest = async ({ file, withCredentials }: UploadCustomRequestOptions) => {
    const formData = new FormData()

    const flag = images.value.some((item) => {
      if (item.id === fileList.value[fileList.value.length - 1].id) {
        return true
      }
      return false
    })

    if (!flag) {
      images.value.push(fileList.value[fileList.value.length - 1])
    }

    images.value[images.value.length - 1].state = 'loading'

    images.value[images.value.length - 1].size = Intl.NumberFormat('en-US', {
      notation: 'compact',
    }).format(file.file!.size)

    images.value[images.value.length - 1].src = await getBase64(file.file as File)

    formData.append('file', file.file as File, file.name)

    api
      .uploadFileApi(formData, {
        withCredentials,
        onUploadProgress: async (progressEvent: any) => {
          images.value[images.value.length - 1].percentage = progressEvent.progress
        },
      })
      .then((res: any) => {
        // imageUrl.value = res.url.replace('https', 'http').replace('.com', '.com:3001')
        images.value[images.value.length - 1].url = res.url
        images.value[images.value.length - 1].state = 'success'
        message.success('上传成功')
      })
      .catch((error) => {
        images.value[images.value.length - 1].state = 'failed'
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
    loadingColors,
    progressBarStyle,
    onFileListChange,
    removeImage,
    customRequest,
    beforeUpload,
    images,
    clearImages,
    uploadImage,
  }
}
