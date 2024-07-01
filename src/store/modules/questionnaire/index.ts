import { defineStore } from "pinia";
import { type QuestionnaireState, type QuestionnaireType, defaultState } from "./helper";
import { store } from "@/store";

const useQuestionnaireStore = defineStore('questionnaire-store', {
    state: (): QuestionnaireState => defaultState(),
    getters: {
        getCurrentID(): number | null{
            return this.currentID
        },
        getTotal(): number {
            return this.total
        },
        getQuestionnaire(): QuestionnaireType[] {
            return this.questionnaire
        }
    },
    actions: {
        changeCurrentID(realID: number){
            this.currentID = realID
        },
        updateTotal(newTotal: number){
            this.total = newTotal
        },
        // 上传新问卷
        updateQuestionnaire(newItem: QuestionnaireType){
            /*
                api
            */
           this.questionnaire.push(newItem)
        },
    }
})

export function useQuestionnaireStoreWithOut(){
    return useQuestionnaireStore(store)
}

/*
id: null,
name: '未命名问卷',
description: null,
question: null,
url: null,
agents: null,
model: null
*/