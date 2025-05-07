import { localStorageHelper } from "./local-storage.helper";

export const permissions = (slug: string): boolean => {


    let access = false;
    const partes = slug.split("/").filter(Boolean);
    const [menu, submenu, modulo, permiso] = partes;
    let sidebar = []
    const _proyect_empresa_id = localStorageHelper.getItemObject("_proyect_empresa_id")
    const navegacion = localStorageHelper.getItemObject("__navegacion") || []
    const findNavegacion = navegacion.find((dt) => dt.empresaID == _proyect_empresa_id)
    if (findNavegacion) sidebar = findNavegacion.sidebar

    const findMenu = sidebar.find((dtMenu) => dtMenu.path === menu);
    if (findMenu) {
        const findSubmenu = findMenu.children?.find((dtSubmenu) => dtSubmenu.path === submenu);
        if (findSubmenu) {
            const findModulo = findSubmenu.children?.find((dtModulo) => dtModulo.path === modulo);
            if (findModulo) {
                const permisosArray = findModulo.permisos.permisosCodeText.split(",");

                if (permisosArray.includes(permiso)) {
                    access = true;
                }
            }
        }
    }
    slug
    access
    // debugger
    return access;
    // return true;
}