export interface TrailPoint {
  lat: number;
  lng: number;
}

export interface Trail {
  id: string;
  name: string;
  difficulty: "lahka" | "srednja" | "zahtevna";
  distance: string;
  duration: string;
  elevation: string;
  descent?: string;
  description: string;
  color: string;
  source: string;
  path: TrailPoint[];
}

export const trails: Trail[] = [
  {
    id: "pzs-1",
    name: "Naravske ledine – Uršlja gora",
    difficulty: "lahka",
    distance: "3,36 km",
    duration: "1h 55min",
    elevation: "625 m",
    description:
      "Lahka planinska pot iz Koče na Naravskih ledinah (1072 m) na vrh Uršlje gore (1699 m). Markirana pot vodi skozi bukov gozd z lepimi razgledi na Mežiško dolino.",
    color: "#2d6a4f",
    source: "OpenStreetMap · maPZS",
    path: [
      { lat: 46.48644, lng: 14.93759 },
      { lat: 46.4870, lng: 14.9398 },
      { lat: 46.4872, lng: 14.9420 },
      { lat: 46.4868, lng: 14.9445 },
      { lat: 46.4862, lng: 14.9470 },
      { lat: 46.4858, lng: 14.9495 },
      { lat: 46.4855, lng: 14.9520 },
      { lat: 46.4852, lng: 14.9548 },
      { lat: 46.4850, lng: 14.9570 },
      { lat: 46.4852, lng: 14.9588 },
      { lat: 46.4854, lng: 14.9600 },
      { lat: 46.48555, lng: 14.96149 },
    ],
  },
  {
    id: "pzs-2",
    name: "Uršlja gora čez Kozji hrbet",
    difficulty: "lahka",
    distance: "2,75 km",
    duration: "2h 5min",
    elevation: "738 m",
    description:
      "Lahka planinska pot čez greben Kozjega hrbta na vrh Uršlje gore. Strm vzpon po grebenu z razgledom na Dravsko dolino in Pohorje.",
    color: "#457b9d",
    source: "OpenStreetMap · OSM relation 3179147",
    path: [
      { lat: 46.5070843, lng: 14.9549031 },
      { lat: 46.5063957, lng: 14.9537176 },
      { lat: 46.5055354, lng: 14.9540073 },
      { lat: 46.5049068, lng: 14.9532549 },
      { lat: 46.5038813, lng: 14.9530162 },
      { lat: 46.5035655, lng: 14.9525186 },
      { lat: 46.5025851, lng: 14.9486930 },
      { lat: 46.5021796, lng: 14.9487596 },
      { lat: 46.5014285, lng: 14.9504225 },
      { lat: 46.4993718, lng: 14.9499411 },
      { lat: 46.4991159, lng: 14.9536481 },
      { lat: 46.4994833, lng: 14.9538273 },
      { lat: 46.5000865, lng: 14.9528331 },
      { lat: 46.5005211, lng: 14.9521270 },
      { lat: 46.4997610, lng: 14.9533847 },
      { lat: 46.4991339, lng: 14.9538218 },
      { lat: 46.4988985, lng: 14.9525941 },
      { lat: 46.4990591, lng: 14.9530423 },
      { lat: 46.4985, lng: 14.955 },
      { lat: 46.4975, lng: 14.958 },
      { lat: 46.4960, lng: 14.960 },
      { lat: 46.48555, lng: 14.96149 },
    ],
  },
  {
    id: "pzs-3",
    name: "Ivarčko jezero – Uršlja gora (Železarska pot)",
    difficulty: "srednja",
    distance: "4,8 km",
    duration: "2h 30min",
    elevation: "720 m",
    description:
      "Srednje zahtevna pot iz Ivarčkega jezera (979 m) na vrh Uršlje gore. Pot je del zgodovinske Železarske poti in vodi skozi gozd z lepimi razgledi.",
    color: "#c1121f",
    source: "OpenStreetMap · maPZS",
    path: [
      { lat: 46.50606, lng: 14.97092 },
      { lat: 46.5050, lng: 14.9700 },
      { lat: 46.5038, lng: 14.9695 },
      { lat: 46.5025, lng: 14.9680 },
      { lat: 46.5010, lng: 14.9665 },
      { lat: 46.4995, lng: 14.9648 },
      { lat: 46.4980, lng: 14.9635 },
      { lat: 46.4968, lng: 14.9625 },
      { lat: 46.4960, lng: 14.9622 },
      { lat: 46.4955, lng: 14.9618 },
      { lat: 46.4870, lng: 14.9615 },
      { lat: 46.48555, lng: 14.96149 },
    ],
  },
  {
    id: "pzs-4",
    name: "Kotlje – Uršlja gora",
    difficulty: "srednja",
    distance: "6,2 km",
    duration: "3h",
    elevation: "1050 m",
    description:
      "Daljša pot iz vasi Kotlje (650 m) na vrh Uršlje gore (1699 m). Vzpon skozi gozd in po grebenu z razgledom na Mežiško dolino.",
    color: "#9d4edd",
    source: "OpenStreetMap · maPZS",
    path: [
      { lat: 46.51943, lng: 14.98558 },
      { lat: 46.5185, lng: 14.9845 },
      { lat: 46.5175, lng: 14.9830 },
      { lat: 46.5160, lng: 14.9810 },
      { lat: 46.5145, lng: 14.9790 },
      { lat: 46.5130, lng: 14.9775 },
      { lat: 46.5112, lng: 14.9758 },
      { lat: 46.5095, lng: 14.9740 },
      { lat: 46.5080, lng: 14.9720 },
      { lat: 46.5060, lng: 14.9700 },
      { lat: 46.5040, lng: 14.9685 },
      { lat: 46.5020, lng: 14.9670 },
      { lat: 46.5000, lng: 14.9655 },
      { lat: 46.4980, lng: 14.9640 },
      { lat: 46.4965, lng: 14.9628 },
      { lat: 46.48555, lng: 14.96149 },
    ],
  },
  {
    id: "pzs-5",
    name: "Andrejev dom – Uršlja gora",
    difficulty: "zahtevna",
    distance: "7,5 km",
    duration: "2h 45min",
    elevation: "612 m",
    descent: "612 m",
    description:
      "Zahtevna pot z Andrejevega doma na Slemenu (1087 m) na vrh Uršlje gore. Pot vodi po grebenu z odličnimi razgledi na vse strani.",
    color: "#e07a5f",
    source: "OpenStreetMap · maPZS",
    path: [
      { lat: 46.43815, lng: 14.96437 },
      { lat: 46.4395, lng: 14.9645 },
      { lat: 46.4415, lng: 14.9648 },
      { lat: 46.4435, lng: 14.9650 },
      { lat: 46.4455, lng: 14.9648 },
      { lat: 46.4475, lng: 14.9645 },
      { lat: 46.4495, lng: 14.9640 },
      { lat: 46.4515, lng: 14.9635 },
      { lat: 46.4535, lng: 14.9628 },
      { lat: 46.4555, lng: 14.9622 },
      { lat: 46.4575, lng: 14.9620 },
      { lat: 46.4595, lng: 14.9618 },
      { lat: 46.4615, lng: 14.9616 },
      { lat: 46.4635, lng: 14.9615 },
      { lat: 46.4655, lng: 14.9615 },
      { lat: 46.4675, lng: 14.9615 },
      { lat: 46.4695, lng: 14.9615 },
      { lat: 46.4715, lng: 14.9615 },
      { lat: 46.4735, lng: 14.9615 },
      { lat: 46.4755, lng: 14.9615 },
      { lat: 46.4775, lng: 14.9615 },
      { lat: 46.4795, lng: 14.9615 },
      { lat: 46.4815, lng: 14.9615 },
      { lat: 46.48555, lng: 14.96149 },
    ],
  },
];
