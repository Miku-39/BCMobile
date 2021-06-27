import { call, put } from 'redux-saga/effects'

import { login, isLogging, logged, loginFailed } from '../actions/Session'
import api from '../../api'

function * loginSaga(action) {
    const { user, password } = action.payload
    yield put(isLogging())

    try {
        //login and get basic session data
        const loginResponse = yield call(api.login, user, password)
        const { access_token } = loginResponse.data
        yield call(api.setAuthHeader, access_token)
        const sessionResponse = yield call(api.authorize)
        const {
                id,
                name,
                companyId,
                accountId,
                department,
                accountName,
                roles,
                company,
              } = sessionResponse.data

        console.log('Instance: ' + accountId)
        console.log('Token: ' + access_token)

        //get any other necessary data
        const carParkings = (yield call(api.fetchParkingsForCars)).data
        const employees = (yield call(api.fetchEmployees)).data
        const priorities = (yield call(api.fetchPriorities)).data
        const isLesnaya = accountId == '14366'

        //save session
        const session = {
            token: access_token,
            userId: id,
            user: name,
            companyId: companyId,
            accountId: accountId,
            account: accountName,
            roles: roles,
            carParkings: carParkings,
            isLesnaya: isLesnaya,
            department: company.departmentId,
            departmentId: department,
            priorities: priorities,
            employees: employees,
            //goodsParkings: goodsParkings,
            //services: services
        }
        console.log(priorities[0])
        console.log(employees[0])
        //yield put(isLogging(false))
        yield put(logged(session))
    }
    catch (error) {
        //yield put(isLogging(false))
        yield put(loginFailed(error.message))
    }
}

export default loginSaga
