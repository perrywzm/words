const Colors = [
  "#d1352b", // red
  "#1B9AAA",
  "#B9F18C",
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928"
];

export const getRandomLightColor = (luminosity = 0.7) => {
  const r = randChannel(luminosity);
  const g = randChannel(luminosity);
  const b = randChannel(luminosity);
  return `rgb(${r}, ${g}, ${b}`;
};

const randChannel = luminosity =>
  (Math.random() * (1 - luminosity) + luminosity) * 255;

export default Colors;