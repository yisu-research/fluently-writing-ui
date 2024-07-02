<script setup lang="ts">
import{ ref } from 'vue'
import { Tab, TabGroup, TabList, TabPanel, TabPanels  } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import Editor from './components/questionnaire-editor.vue'
import Agent from './components/questionnaire-agent.vue'
import Finish from './components/questionnaire-finish.vue'
import { type AgentType, ModelType, type QuestionnaireType } from '@/store/modules/questionnaire/helper';
import { useQuestionnaireStoreWithOut } from '@/store/modules/questionnaire';

const router = useRouter()
const questionnaireStore = useQuestionnaireStoreWithOut()

const diaTitle = [
    '编辑问卷',
    '设置分组',
    '完成'
]

const step = ref(0)


const questionnaireTmp: QuestionnaireType = ref({
    id: questionnaireStore.getTotal,
    name: '未命名的问卷',
    description: '',
    question: [],
    url: '',
    agents: [],
    model: ModelType.gpt4o,
    time: ''
})



function backToList() {
    router.push('/questionnaire')
}
</script>

<template>
    <div class="flex flex-col">
        <div>
            <button 
                type="button"
                class="w-[100px] h-[30px] justify-center my-[6px] ml-[32px] py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                @click="backToList"
                >
                返回
            </button>
        </div>

        <div>
            <TabGroup :selected-index="step" >
                <TabList class="flex flex-row justify-center space-x-[400px] top-[50px] p-2 w-full pointer-events-none border">
                    <Tab
                        v-for="(item,index) of diaTitle" 
                        :key="index"
                        class="w-[100px]">
                        <span
                            class=""
                            :class="(index === step)? 'bg-slate-500' : 'bg-white'"
                            >
                            {{ item }}
                        </span>
                        
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel><Editor v-if="step===0" v-model:questionnaire-tmp="questionnaireTmp" v-model:step="step"/></TabPanel>
                    <TabPanel><Agent v-if="step===1" v-model:agents-tmp="questionnaireTmp.agents" v-model:step="step"/></TabPanel>
                    <TabPanel><Finish v-if="step===2" v-model:questionnaire-tmp="questionnaireTmp" v-model:step="step"/></TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    </div>
</template>

<style scope></style>