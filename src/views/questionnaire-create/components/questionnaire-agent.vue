<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useMessage } from 'naive-ui';
import { toReactive } from '@vueuse/core';
import type { AgentType, RequirementType } from '@/store/modules/questionnaire/helper';
import { deepClone } from '@/utils/deepClone'
import { SvgIcon } from '@/components/common'

const props = defineProps<{
    agentsTmp: AgentType[],
    step: number
}>()
const emit = defineEmits(['update:angentsTmp','update:step'])
const { agentsTmp } = toReactive(props)

const message = useMessage()

const title = [
    '组别名',
    '框选条件',
    '组别人数'
]

const reData = computed(() => {
    if(agentsTmp && agentsTmp.length!==0){
        const array = []
        for(let i=0; i<agentsTmp.length; ++i){
            let str = ''
            for(let j=0; j<agentsTmp[i].requirement.length; ++j){
                str = `${str+agentsTmp[i].requirement[j].title}：${agentsTmp[i].requirement[j].selectedRequirement}，`       
            }
            array.push(str)
        }
        return array
    }
    else {
        return []
    }

})
const isAddAgentPanelOpen = ref(false)
function addAgent() {
    isAddAgentPanelOpen.value = true
}
function closeModal() {
    isAddAgentPanelOpen.value = false
}

const reTmp: RequirementType[] = reactive([])
const agentTmp: AgentType = ref({
    name: '新组别',
    number: 0,
    requirement: []
})
function addRequirement() {
    if(reTmp.length >= 5) {
        message.warning("条件个数已达上限")
        return 
    }
    reTmp.push({
        title: '新条件',
        description: '',
        selectedRequirement: '',
    })
}
function deleteOption(index: number){
    reTmp.splice(index,1)
}

function submitRequirement() {
    if(!agentTmp.value.name || agentTmp.value.name === ''){
        message.warning("请为您的组别命名！")
        return 
    }
    if(agentTmp.value.number <= 0) {
        message.warning("请为您的组别设置一个大于0的人数！")
        return 
    }
    const reClone = deepClone(reTmp)
    if(!reClone || reClone.length < 1){
        message.warning("请添加条件!")
        return 
    }
    for(let i=0; i<reClone.length; ++i){
        if(!reClone[i].title || reClone[i].title === ''){
            message.warning("请为您的每个组别命名！")
            return
        }
        if(!reClone[i].description || reClone[i].description === ''){
            message.warning("请为您的每个组别填写描述！")
            return
        }
        if(!reClone[i].selectedRequirement || reClone[i].selectedRequirement === ''){
            message.warning("请为您的每个组别添加框选条件！")
            return
        }
    }
    agentTmp.value.requirement = reClone
    reTmp.length = 0
    agentsTmp.push(deepClone(agentTmp.value))
    agentTmp.value = {
        name: '新组别',
        number: 0,
        requirement: []
    }
    isAddAgentPanelOpen.value = false 
}

function goToLastStep() {
    emit('update:step', 0)
}
function finishEditorAgents() {
    if(!agentsTmp || agentsTmp.length === 0) {
        message.warning("请添加组别！")
        return 
    }
    emit('update:angentsTmp',agentsTmp)
    emit('update:step',2)
}
</script>

<template>

    <div>
        <!-- FAQ -->
        <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

            <div class="w-full mx-[00px] mt-[100px] ">
            
                <div class="grid grid-cols-3 gap-6 justify-items-center">
                    <div v-for="(item, index) of title" :key="index">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                            {{ item }}
                        </h3>
                    </div>
                </div>
               
                <div v-for="(item, index) of agentsTmp" :key="index" class="grid grid-cols-3 gap-6 py-8 justify-items-center">
                    <div >
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                            {{ item.name }}
                        </h3>

                    </div>
                    <div>
                        <h3>
                        <div v-for="(re,i) of reData" :key="i" class="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                            {{ re }}
                        </div>
                        </h3>

                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                            {{ item.number }}
                        </h3>
                    </div>
                 
                </div>

                <div>
                    <button 
                        type="button" 
                        class="w-[100px] h-[30px] justify-center ml-[600px] mt-[50px] text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='addAgent'
                        >
                        新增组别
                    </button>
                </div>

                <div class="flex flex-row justify-center">
                    <button 
                        type="button" 
                        class="w-[100px] h-[30px] mt-[50px] text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='goToLastStep'
                        >
                        上一步
                    </button>
                    <button 
                        type="button" 
                        class="w-[100px] h-[30px]  ml-[300px] mt-[50px] text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='finishEditorAgents'
                        >
                        下一步
                    </button>
                </div>


            </div>
        
        </div>
        <!-- End FAQ -->

        <div>
            <TransitionRoot appear :show="isAddAgentPanelOpen" as="template">
                <Dialog as="div" @close="closeModal" class="relative z-10">
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
                    <div
                    class="flex min-h-full items-center justify-center p-4 text-center"
                    >
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
                        class="w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <div>
                                <div class="flex flex-row space-x-5 my-2">
                                    <label class="w-[100px] text-left m-auto">组别名</label>
                                    <input v-model="agentTmp.name" type="text" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="请输入组别名称">
                                </div>
                                <div class="flex flex-row space-x-5 my-2">
                                    <label class="w-[100px] text-left m-auto">人数</label>
                                    <input v-model="agentTmp.number" type="text" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="请输入人数">
                                </div>
                                <div>
                                    <div class="flex flex-row space-x-5 ">
                                        <label class="w-[100px] text-left mt-[10px] justify-start">组别条件</label>
                                        <div class="w-full">
                                            <div class="grid grid-cols-7 gap-6 my-2 justify-items-center">
                                                <div class="col-span-2">
                                                    <span>框选项</span>
                                                </div>
                                                <div class="col-span-2">
                                                    <span>框选描述</span>
                                                </div>
                                                <div class="col-span-2">
                                                    <span>框选条件</span>
                                                </div>
                                            </div>
                                            <div v-for="(item, index) of reTmp" :key="index" class="grid grid-cols-7 gap-6 my-2 justify-items-center">
                                                <div class="col-span-2">
                                                    <input
                                                        v-model="item.title" 
                                                        type="text" 
                                                        class="py-3 px-4 block w-[180px] border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                                        placeholder="">
                                                </div>
                                                <div class="col-span-2">
                                                    <input
                                                        v-model="item.description" 
                                                        type="text" 
                                                        class="py-3 px-4 block w-[180px] border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                                        placeholder="">
                                                </div>
                                                <div class="col-span-2">
                                                    <input
                                                        v-model="item.selectedRequirement" 
                                                        type="text" 
                                                        class="py-3 px-4 block w-[180px] border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                                        placeholder="">
                                                </div>
                                                <div  class="cursor-pointer" @click="deleteOption(index)">
                                                    <SvgIcon icon="hugeicons:delete-04" class="w-6 h-6 shrink-0 my-auto" aria-hidden="true" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row space-x-12 justify-center">
                                    <button 
                                            type="button" 
                                            class="w-[100px] h-[30px] justify-center  text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                            @click='addRequirement'
                                            >
                                            添加
                                    </button>
                                    <button 
                                            type="button" 
                                            class="w-[100px] h-[30px] justify-center  text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                            @click='submitRequirement'
                                            >
                                            完成
                                    </button>
                                </div>
                            </div>

                        </DialogPanel>
                    </TransitionChild>
                    </div>
                </div>
                </Dialog>
            </TransitionRoot>
        </div>
    </div>

</template>

<style scope></style>

