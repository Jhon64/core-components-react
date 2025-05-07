import { HeadersDefaults } from "axios"

interface IHttp {
	baseURL?: string
	url: string
	params?: string | object
	headers?: HeadersDefaults
}

export interface IHttpResponse {
	data: any
	status: number
	statusText: string
	error?: string
	message?: string
}