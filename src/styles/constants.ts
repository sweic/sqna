import { css } from "styled-components";

export const color = {
  primary: "#4CA0DD", // blue
  bg: "#262626", // dark grey
  secondary: "#313131", // light grey
  highlight: "#257fc1", // darker blue
};

export const font = {
  app: 'font-family: "Ping"; font-weight: normal;',
  size: (size: number) => `font-size: ${size}px;`,
};
export type FixedLengthArray<TItem, TLength extends number> = [
  TItem,
  ...TItem[]
] & { length: TLength };

export const appTheme = {
  colors: {
    primary: [
      "#eaf4fb",
      "#bfddf3",
      "#94c6eb",
      "#69afe3",
      "#3e99da",
      "#257fc1",
      "#1c6396",
      "#0c2a40",
      "#4CA0DD",
      "#257fc1",
    ] as FixedLengthArray<string, 10>,
    secondary: [
      "#f2f2f2",
      "#d9d9d9",
      "#bfbfbf",
      "#a6a6a6",
      "#8c8c8c",
      "#737373",
      "#313131",
      "#262626",
      "#171717",
      "#0d0d0d",
    ] as FixedLengthArray<string, 10>,
  },
};

export const mixins = {
  scrollableY: css`
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `,
  boxShadowMedium: css`
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  `,
};
