export interface BaseResponseType<T> {
	success: boolean
	data: T
	message: string
}

export interface BaseErrorResponseType {
	success: boolean
	data: any
	message: string
}

export interface ServerValidateErrorType {
	location: string
	param: string
	value: string
	msg: string
}

export interface User {
	_id: string
	username: string
	password: string
}
