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
  startPoint: string;
  endPoint: string;
  description: string;
  color: string;
  source: string;
  path: TrailPoint[];
}

// Vrh Uršlje gore (cilj vseh poti)
const SUMMIT = { lat: 46.48555, lng: 14.96149 };

export const trails: Trail[] = [
  {
    id: "trail-1",
    name: "Koča na Naravskih ledinah – Uršlja gora",
    difficulty: "lahka",
    distance: "3,4 km",
    duration: "1h 45min",
    elevation: "627 m",
    startPoint: "Koča na Naravskih ledinah (1072 m)",
    endPoint: "Dom na Uršlji gori → vrh (1699 m)",
    description:
      "Lahka označena pot iz Koče na Naravskih ledinah (1072 m) na vrh Uršlje gore. Pot vodi skozi bukov gozd in travnike z lepimi razgledi na Mežiško dolino. Na vrhu Cerkev sv. Uršule in Dom na Uršlji gori.",
    color: "#2d6a4f",
    source: "hribi.net · lahka označena pot",
    path: [
      { lat: 46.48610, lng: 14.93860 }, // Koča na Naravskih ledinah
      { lat: 46.4868, lng: 14.9410 },
      { lat: 46.4865, lng: 14.9438 },
      { lat: 46.4860, lng: 14.9465 },
      { lat: 46.4856, lng: 14.9492 },
      { lat: 46.4853, lng: 14.9520 },
      { lat: 46.4851, lng: 14.9548 },
      { lat: 46.4852, lng: 14.9572 },
      { lat: 46.4853, lng: 14.9590 },
      { lat: 46.48473, lng: 14.96503 }, // Dom na Uršlji gori
      { lat: 46.48555, lng: 14.96149 }, // Vrh
    ],
  },
  {
    id: "trail-2",
    name: "Ivarčko jezero – Uršlja gora (Železarska pot)",
    difficulty: "lahka",
    distance: "6,5 km",
    duration: "2h 45min",
    elevation: "1066 m",
    startPoint: "Ivarčko jezero (633 m)",
    endPoint: "Dom na Uršlji gori → vrh (1699 m)",
    description:
      "Lahka označena pot iz Ivarčkega jezera (633 m) po zgodovinski Železarski poti na vrh. Pot vodi mimo partizanskega spomenika, skozi mešani gozd, mimo izvira Uršljice do Doma na Uršlji gori in vrha.",
    color: "#457b9d",
    source: "hribi.net · lahka označena pot",
    path: [
      { lat: 46.50660, lng: 14.96890 }, // Ivarčko jezero
      { lat: 46.5055, lng: 14.9685 },
      { lat: 46.5040, lng: 14.9675 },
      { lat: 46.5025, lng: 14.9660 },
      { lat: 46.5010, lng: 14.9650 },
      { lat: 46.4995, lng: 14.9638 },
      { lat: 46.4978, lng: 14.9628 },
      { lat: 46.4960, lng: 14.9622 },
      { lat: 46.4942, lng: 14.9618 },
      { lat: 46.4920, lng: 14.9615 },
      { lat: 46.4900, lng: 14.9613 },
      { lat: 46.4880, lng: 14.9612 },
      { lat: 46.48473, lng: 14.96503 }, // Dom na Uršlji gori
      { lat: 46.48555, lng: 14.96149 }, // Vrh
    ],
  },
  {
    id: "trail-3",
    name: "Ivarčko jezero – Uršlja gora (Grofovska pot)",
    difficulty: "lahka",
    distance: "6,8 km",
    duration: "2h 50min",
    elevation: "1066 m",
    startPoint: "Ivarčko jezero (633 m)",
    endPoint: "Dom na Uršlji gori → vrh (1699 m)",
    description:
      "Lahka neoznačena pot iz Ivarčkega jezera po Grofovski poti. Pot sledi potoku Uršljica skozi gozd, mimo zavetišča pod jelko, se priključi Železarski poti in se vzpne do Doma na Uršlji gori ter vrha.",
    color: "#9b2335",
    source: "hribi.net · lahka neoznačena pot",
    path: [
      { lat: 46.50660, lng: 14.96890 }, // Ivarčko jezero
      { lat: 46.5058, lng: 14.9700 },
      { lat: 46.5048, lng: 14.9710 },
      { lat: 46.5035, lng: 14.9705 },
      { lat: 46.5020, lng: 14.9695 },
      { lat: 46.5005, lng: 14.9680 },
      { lat: 46.4990, lng: 14.9665 },
      { lat: 46.4972, lng: 14.9648 },
      { lat: 46.4955, lng: 14.9635 },
      { lat: 46.4935, lng: 14.9625 },
      { lat: 46.4912, lng: 14.9618 },
      { lat: 46.4890, lng: 14.9614 },
      { lat: 46.48473, lng: 14.96503 }, // Dom na Uršlji gori
      { lat: 46.48555, lng: 14.96149 }, // Vrh
    ],
  },
  {
    id: "trail-4",
    name: "Ciganija – Uršlja gora",
    difficulty: "lahka",
    distance: "5,2 km",
    duration: "2h 15min",
    elevation: "584 m",
    startPoint: "Ciganija (1115 m)",
    endPoint: "Cerkev sv. Uršule → vrh (1699 m)",
    description:
      "Lahka označena pot iz Ciganije (1115 m) na vrh Uršlje gore. Pot vodi skozi gozd in travnike z lepimi pogledi, mimo Šišernika (1259 m) do vrha s Cerkvijo sv. Uršule — najvišje ležeče cerkve v Sloveniji.",
    color: "#e07a5f",
    source: "hribi.net · lahka označena pot",
    path: [
      { lat: 46.45320, lng: 14.95710 }, // Ciganija
      { lat: 46.4552, lng: 14.9572 },
      { lat: 46.4575, lng: 14.9575 },
      { lat: 46.4600, lng: 14.9578 },
      { lat: 46.4625, lng: 14.9580 },
      { lat: 46.4652, lng: 14.9582 },   // Šišernik območje
      { lat: 46.4678, lng: 14.9585 },
      { lat: 46.4705, lng: 14.9588 },
      { lat: 46.4732, lng: 14.9590 },
      { lat: 46.4760, lng: 14.9595 },
      { lat: 46.4788, lng: 14.9600 },
      { lat: 46.4815, lng: 14.9605 },
      { lat: 46.48427, lng: 14.96497 }, // Cerkev sv. Uršule
      { lat: 46.48555, lng: 14.96149 }, // Vrh
    ],
  },
  {
    id: "trail-5",
    name: "Ciganija – Uršlja gora (zimska pot)",
    difficulty: "lahka",
    distance: "5,5 km",
    duration: "2h 30min",
    elevation: "584 m",
    startPoint: "Ciganija (1115 m)",
    endPoint: "Dom na Uršlji gori → vrh (1699 m)",
    description:
      "Zimska različica poti iz Ciganije na vrh Uršlje gore. Pot vodi mimo Križana (1040 m) in Šišernika (1259 m) do Doma na Uršlji gori (1680 m). Pozimi priporočljivi dereze in cepin.",
    color: "#5a8fa3",
    source: "hribi.net · lahka označena pot (zimska)",
    path: [
      { lat: 46.45320, lng: 14.95710 }, // Ciganija
      { lat: 46.4548, lng: 14.9560 },
      { lat: 46.4570, lng: 14.9555 },
      { lat: 46.4595, lng: 14.9558 },
      { lat: 46.4622, lng: 14.9562 },
      { lat: 46.4650, lng: 14.9568 },   // Šišernik območje
      { lat: 46.4678, lng: 14.9572 },
      { lat: 46.4708, lng: 14.9578 },
      { lat: 46.4738, lng: 14.9582 },
      { lat: 46.4768, lng: 14.9588 },
      { lat: 46.4798, lng: 14.9595 },
      { lat: 46.48473, lng: 14.96503 }, // Dom na Uršlji gori
      { lat: 46.48555, lng: 14.96149 }, // Vrh
    ],
  },
  {
    id: "trail-6",
    name: "Žerjav – Uršlja gora",
    difficulty: "lahka",
    distance: "9,2 km",
    duration: "3h 15min",
    elevation: "1119 m",
    startPoint: "Žerjav (580 m)",
    endPoint: "Koča na Naravskih ledinah → vrh (1699 m)",
    description:
      "Lahka označena pot iz rudarskega mestca Žerjav (580 m) na vrh. Pot sledi dolini Jazbinega potoka, preide v makadamsko pot in vodi skozi gozd do Koče na Naravskih ledinah (1072 m) ter naprej na vrh Uršlje gore.",
    color: "#9d4edd",
    source: "hribi.net · lahka označena pot",
    path: [
      { lat: 46.48190, lng: 14.89950 }, // Žerjav
      { lat: 46.4820, lng: 14.9050 },
      { lat: 46.4822, lng: 14.9108 },
      { lat: 46.4825, lng: 14.9165 },
      { lat: 46.4828, lng: 14.9222 },
      { lat: 46.4832, lng: 14.9275 },
      { lat: 46.4838, lng: 14.9320 },
      { lat: 46.4845, lng: 14.9358 },
      { lat: 46.48610, lng: 14.93860 }, // Koča na Naravskih ledinah
      { lat: 46.4868, lng: 14.9410 },
      { lat: 46.4862, lng: 14.9465 },
      { lat: 46.4855, lng: 14.9520 },
      { lat: 46.4851, lng: 14.9572 },
      { lat: 46.48473, lng: 14.96503 }, // Dom na Uršlji gori
      { lat: 46.48555, lng: 14.96149 }, // Vrh
    ],
  },
];
