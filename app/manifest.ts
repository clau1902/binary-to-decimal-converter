import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DECODE — Number Converter",
    short_name: "DECODE",
    description: "Convert binary and hexadecimal numbers to decimal",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
  };
}
