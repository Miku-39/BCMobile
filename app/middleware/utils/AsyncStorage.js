import { AsyncStorage } from 'react-native'



export const storeCredentials = async (user, password) => {
    try {
        await AsyncStorage.setItem('@bcmobileapp:remember', 'true')
        await AsyncStorage.setItem('@bcmobileapp:user', user)
        await AsyncStorage.setItem('@bcmobileapp:password', password)
    } catch (error) {
        console.warn('error occured while saving user info', error)
    }
}

export const loadCredentials = async () => {
    try {
        const r = await AsyncStorage.getItem('@bcmobileapp:remember')
        if (r !== 'true')
            return {}

        const user = await AsyncStorage.getItem('@bcmobileapp:user')
        const password = await AsyncStorage.getItem('@bcmobileapp:password')
        return { remember: true, user, password }
    } catch (error) {
        console.warn('error occured while retrieving user info', error)
    }
}
