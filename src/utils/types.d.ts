// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';

declare module 'axios' {
	export interface AxiosInstance {
		request: <T = any>(config: AxiosRequestConfig) => Promise<T>
		get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>
		delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>
		head: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>
		post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
		put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
		patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
	}
}

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
	id: string
	username: string
	password?: string
	avatarUrl?: string
}

export interface Board {
	id: string
	user: string
	icon: string
	title: string
	description: string
	position: number
	favourite: boolean
	favouritePosition: number
}

export interface Section {
	id: string
	board: string
	title: string
	tasks?: Task[]
}

export interface Task {
	id: string
	section: string
	title: string
	content: string
	position: number
}
