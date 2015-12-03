import { AsyncStorage } from 'react-native'
//react native
export default async (store, defaultState) => await AsyncStorage.getItem(store) || defaultState
