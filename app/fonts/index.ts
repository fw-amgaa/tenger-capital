import localFont from "next/font/local";

export const ttCommons = localFont({
  src: [
    // Thin (100)
    {
      path: "./TTCommons/TTCommons-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    // ExtraLight (200)
    {
      path: "./TTCommons/TTCommons-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    // Light (300)
    {
      path: "./TTCommons/TTCommons-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    // Regular (400)
    {
      path: "./TTCommons/TTCommons-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    // Medium (500)
    {
      path: "./TTCommons/TTCommons-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    // DemiBold (600)
    {
      path: "./TTCommons/TTCommons-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-DemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    // Bold (700)
    {
      path: "./TTCommons/TTCommons-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    // ExtraBold (800)
    {
      path: "./TTCommons/TTCommons-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    // Black (900)
    {
      path: "./TTCommons/TTCommons-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./TTCommons/TTCommons-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-ttcommons",
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
