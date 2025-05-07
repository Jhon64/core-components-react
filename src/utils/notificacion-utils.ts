import { Loading, Notify } from 'notiflix'
export namespace NotificacionUtils {
	export const loading = {
		loading: (text?: string) => {
			Loading.circle(text ? text : 'Loading...',{zindex:99999})
			// Loading.standard('Loading...')
		},
		remove: () => {
			Loading.remove()
		},
	}

	export const error = (text?: string) => {
		Notify.failure(text || 'Error',null,{zindex:99999})
	}

	export const info = (text?: string) => {
		Notify.info(text || 'Info',null,{zindex:99999})
	}
	export const warning = (text?: string) => {
		Notify.warning(text || 'Info',null,{zindex:99999})
	}

	export const success = (text?: string) => {
		Notify.success(text || 'Success',null,{zindex:99999})
	}
}