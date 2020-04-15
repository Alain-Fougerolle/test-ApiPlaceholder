import * as types from '../constants'

export const changeStatus = status => ({
	type : types.CHANGE_STATUS,
	value : status
});