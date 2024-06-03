<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import {NIcon, NP, NText, NUpload, NUploadDragger} from 'naive-ui'
  
const component = defineComponent({
    components:{
        ArchiveIcon
    }
})

const isHidden = ref("hidden")

const openUploadImg = () =>{
  isHidden.value = "";
};

const closeUploadImg = () =>{
  isHidden.value = "hidden";
}

defineExpose({
  openUploadImg,
  closeUploadImg,
})

</script>

<template>
  <div :class="isHidden" class="fixed inset-0 place-content-center z-50 opacity-25 ">
    <NUpload
          multiple
          directory-dnd:true
          show-file-list:false
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          :max="5"
        >
          <NUploadDragger class="fixed inset-0 place-content-center z-50" >
            <div style="margin-bottom: 12px">
              <NIcon size="48" :depth="3">
                <ArchiveIcon/>
              </NIcon>
            </div>
            <NText style="font-size: 16px">
              点击或者拖动文件到该区域来上传
            </NText>
            <NP depth="3" style="margin: 8px 0 0 0">
              请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
            </NP>
          </NUploadDragger>
    </NUpload>
</div>
</template>
