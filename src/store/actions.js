import * as types from './mutation-type'
export const token=function({commit,token}){
    commit(types.SET_TOKEN,true)
}
export const status=function({commit,state}){
    commit(types.SET_STATUS,true)
}