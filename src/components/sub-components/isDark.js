function hexToRgb(hex) {
  // Convert hex color to RGB
  const bigint = parseInt(hex.substring(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function isDark(hex) {
  // Check if the color is dark
  const [r, g, b] = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128; // Adjust this threshold for your needs
}
