export const LOGIN_REQUEST = 'loginRequest'
export const IS_LOGGING = 'isLogging'
export const LOGGED = 'logged'
export const LOGIN_FAILED = 'loginFailure'


export const login = (user, password) => {
    return {
        type: LOGIN_REQUEST,
        payload: {
            user, 
            password
        }
    }
}

export const isLogging = (isLogging) => {
    return {
        type: IS_LOGGING,
        payload: isLogging
    }
}

export const logged = (session) => {
    return {
        type: LOGGED,
        payload: session
    }
}

export const loginFailed = (error) => {
    return {
        type: LOGIN_FAILED,
        payload: error
    }
}
