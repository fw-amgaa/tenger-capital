import { Manrope } from "next/font/google";
import localFont from "next/font/local";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

export const moisette = localFont({
  src: [
    {
      path: "./Moisette/Moisette-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
    {
      path: "./Moisette/Moisette-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-ExtraBoldItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./Moisette/Moisette-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./Moisette/Moisette-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-SemiBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./Moisette/Moisette-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Moisette/Moisette-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Moisette/Moisette-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Moisette/Moisette-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-moisette",
});
