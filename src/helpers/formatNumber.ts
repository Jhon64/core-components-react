export const formatNumber = (value: number): string => {
    return value % 1 === 0 ? `${value}.00` : value.toString();
}