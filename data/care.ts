export interface CareTopic {
  id: string;
  title: string;
  tip: string;
  icon: "droplets" | "wind" | "flame" | "feather" | "snowflake" | "sun" | "palette" | "sparkles";
}

export const careTopics: CareTopic[] = [
  { id: "washing", title: "Washing", tip: "Sort by colour and fabric, and turn printed or dark garments inside out before washing.", icon: "droplets" },
  { id: "drying", title: "Drying", tip: "Check the care label — many knits and synthetics keep their shape better when air dried.", icon: "wind" },
  { id: "ironing", title: "Ironing", tip: "Iron silks and synthetics on low heat, cottons and linens higher. Steam helps release deep creases.", icon: "flame" },
  { id: "delicates", title: "Delicate fabrics", tip: "Embellished, silk and structured garments are usually safest with dry cleaning.", icon: "feather" },
  { id: "woollens", title: "Woollens", tip: "Avoid hot water and wringing. Dry woollens flat so they don't stretch.", icon: "snowflake" },
  { id: "whites", title: "Whites", tip: "Wash whites separately and treat collar and cuff marks early to keep them bright.", icon: "sun" },
  { id: "colours", title: "Colours", tip: "New coloured garments can bleed — wash them separately the first few times.", icon: "palette" },
  { id: "stains", title: "Stains", tip: "Blot, don't rub. Tell us what caused the stain — it helps choose the right treatment.", icon: "sparkles" },
];
