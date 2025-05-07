export const getRandomColorWithSmoothness = (smoothFactor: number = 1): string => {
    // Asegurar que smoothFactor esté entre 0 y 1
    const factor = Math.min(Math.max(smoothFactor, 0), 1);
  
    // Generar un color aleatorio en formato hexadecimal
    const randomColor = (): string => 
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  
    // Convertir color hexadecimal a componentes RGB
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };
  
    // Aclarar el color interpolando entre el color base y el blanco
    const lightenColor = (r: number, g: number, b: number, factor: number) => {
      const newR = Math.round(r + (255 - r) * factor);
      const newG = Math.round(g + (255 - g) * factor);
      const newB = Math.round(b + (255 - b) * factor);
      return { newR, newG, newB };
    };
  
    // Convertir componentes RGB de vuelta a hexadecimal
    const rgbToHex = (r: number, g: number, b: number) =>
      `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  
    // Generar color aleatorio
    const baseColor = randomColor();
    const { r, g, b } = hexToRgb(baseColor);
  
    // Aplicar suavizado al color aleatorio
    const { newR, newG, newB } = lightenColor(r, g, b, factor);
    
    return rgbToHex(newR, newG, newB);
  };