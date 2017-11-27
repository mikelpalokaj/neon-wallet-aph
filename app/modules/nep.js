/**
 * Created by Andrexxjc on 15/11/2017.
 */
// Constants

import { getTokenBalance, getTokenInfo } from 'neon-js'
import asyncWrap from '../core/asyncHelper'
export const SET_NEP5 = 'SET_NEP5';
export const ADD_NEP5 = 'ADD_NEP5';
export const REMOVE_NEP5 = 'REMOVE_NEP_5';
export const ADD_HASH_BALANCE = 'ADD_HASH_BALANCE';

//start with aphelion on your nep5 contracts
let initialNep5ReducerState = ['0xa0777c3ce2b169d4a23bcba4565e3225a0122d95', '0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9'];
let initialNep5Symbols = {
  '0xa0777c3ce2b169d4a23bcba4565e3225a0122d95': 'APH',
  '0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9': 'RPX'
}

// Actions
export function setNep5(nep5){
    return {
        type: SET_NEP5,
        nep5: nep5
    }
}

export function addNep5(hashToAdd){
    return {
        type: ADD_NEP5,
        hash: hashToAdd
    }
}

export function removeNep5(hashToRemove, hashIndex){
  return {
    type: REMOVE_NEP5,
    hash: hashToRemove,
    index: hashIndex
  }
}

export function addHashBalance(hashscript, balance){
    return {
        type: ADD_HASH_BALANCE,
        payload: {
            [hashscript]: balance
        }
    }
}

export const initiateGetAssetsBalance = (net: NetworkType, address: string, nep5: string[]) => async (dispatch: DispatchType) => {
  nep5.map((hash, index) => {
    refreshAssetBalance(net, address, hash, dispatch);
    console.log('calling get token info');
    getTokenInfo(net, hash).then((response) => {
      console.log('response when getting info for hash', hash, response);
    }).catch((e) => {
      console.log('error when getting info for hash', hash, e);
      return false;
    });
  });
}

export const addNepToStore = (hashToAdd: string) => (dispatch: DispatchType) => {
  dispatch(addNep5(hashToAdd));
}

export const removeNepFromStore = (hashToRemove: string, index: integer) => (dispatch: DispatchType) => {
  dispatch(removeNep5(hashToRemove, index));
}

export const setNepToStore = (data: string) => (dispatch: DispatchType) => {
  dispatch(setNep5(data));
}

export const refreshAssetBalance = ( net, address, hashscript, dispatch ) => {
  getTokenBalance(net, hashscript.slice(2, hashscript.length), address).then((balance) => {
    dispatch(addHashBalance(hashscript, balance));
  }).catch((e) => {
    dispatch(addHashBalance(hashscript, 0));
    return false;
  });
}

// reducer for nep5 hash contracts. The initial state will include the hash script for Aphelion
export default (state = { nep5: initialNep5ReducerState , balances: {}, symbols: initialNep5Symbols }, action) => {
    switch (action.type) {
        case SET_NEP5:
            return {...state, nep5: action.nep5 };
        case ADD_NEP5:
            let newState = Object.assign({}, state, { nep5: [ ...state.nep5, action.hash ] });
            return newState;
        case REMOVE_NEP5:
            let removeState = Object.assign({}, state, { nep5: [...state.nep5.slice(0,action.index), ...state.nep5.slice(action.index+1)] });
            return removeState;
        case ADD_HASH_BALANCE:
            let balanceState = Object.assign({}, state, { balances: { ...state.balances, ...action.payload }});
            return balanceState;
        default:
            return state;
    }
};
