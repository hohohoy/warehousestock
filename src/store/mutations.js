import * as types from './mutation-type'
const mutations={
    [types.SET_STATUS](state,status){
        state.status=status;
    },
    [types.SET_TOKEN](state,token){
        state.token=token;
    }
}
export default mutations;
