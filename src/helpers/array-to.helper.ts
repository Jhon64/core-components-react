/**
 * Helper para convertir un array a otro tipo de coleccion
 */
export namespace ArrayToHelper{
  /**Mapa con valor de key string */
  export const MapS = <T>(
    data: any[],
    key: string
  ) => {
    const map = new Map<string, T>();

    for (let reg of data) {
      const keyValue = reg[`${key}`] as string;
      map.set(keyValue, reg);
    }
    return map;
  };

   /**Mapa con valor de key any */
  export const _Map = <T>(
    data: any[],
    key: string,
    grouped?: boolean
  ) => {
    const map = new Map<string, T>();

    for (let reg of data) {
      const keyValue = reg[`${key}`] as any;
      map.set(keyValue, reg);
    }
    return map;
  };
/**Mapa con valor de key number */
  export const MapN = <T>(data: any[], key: string) => {
    const map = new Map<number, T>();

    for (let reg of data) {
      const keyValue = reg[`${key}`] as number;
      map.set(keyValue, reg);
    }
    return map;
  };

  /**Mapa con valor de key string y agrupado */
  export const MapGroupedS = <T>(data: any[], key: string) => {
    const map2 = new Map<string, T[]>();

    for (let reg of data) {
      const keyValue = reg[`${key}`] as string;
      if (map2.has(keyValue)) {
        const regsList = map2.get(keyValue) || [];
        regsList.push(reg);
        map2.set(keyValue, regsList);
      } else {
        map2.set(keyValue, []);
      }
    }
    return map2;
  };
  
  export const MapGroupedN = <T>(data: any[], key: string) => {
    const map2 = new Map<number, T[]>();

    for (let reg of data) {
      const keyValue = reg[`${key}`] as number;
      if (map2.has(keyValue)) {
        const regsList = map2.get(keyValue) || [];
        regsList.push(reg);
        map2.set(keyValue, regsList);
      } else {
        map2.set(keyValue, [reg]);
      }
    }
    return map2;
  };
}