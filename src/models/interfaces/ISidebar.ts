export interface ISidebarData {
	id: string
	rutaID?: any
	moduloID?: any
	name: string
	icono: string
	path: string
	select: boolean
	selectItemChildren?: boolean
	moreDetail?: boolean
	exact?: boolean
	children?: ISidebarData[]
}