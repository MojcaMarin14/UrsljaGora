export type POICategory = "cerkev" | "gostilna" | "dogodek" | "fotografija" | "koca" | "oddajnik";

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  lat: number;
  lng: number;
  description: string;
  date?: string;
  imageUrl?: string;
  allowPhoto?: boolean;
}

export const categoryConfig: Record<
  POICategory,
  { label: string; color: string; icon: string; svgIcon: string }
> = {
  koca: {
    label: "Planinska koča",
    color: "#6b7c5e",
    icon: "koca",
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>`,
  },
  cerkev: {
    label: "Cerkev / kapela",
    color: "#8a7968",
    icon: "cerkev",
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M10 4h4"/><path d="M5 21V10l7-4 7 4v11"/><path d="M9 21v-4h6v4"/></svg>`,
  },
  gostilna: {
    label: "Gostilna / café",
    color: "#9b7653",
    icon: "gostilna",
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  },
  dogodek: {
    label: "Dogodek",
    color: "#4a7c59",
    icon: "dogodek",
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  },
  fotografija: {
    label: "Fotografija",
    color: "#c17e60",
    icon: "fotografija",
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  },
  oddajnik: {
    label: "Oddajnik",
    color: "#5a6e8a",
    icon: "oddajnik",
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M8 6l4-4 4 4"/><path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M3 14c0-5 4-9 9-9s9 4 9 9"/><line x1="10" y1="22" x2="14" y2="22"/></svg>`,
  },
};

export const pois: POI[] = [
  {
    id: "poi-1",
    name: "Cerkev sv. Uršule",
    category: "cerkev",
    lat: 46.48427,
    lng: 14.96497,
    description:
      "Najvišje ležeča cerkev v Sloveniji (1699 m). Gotska cerkev, prvič omenjena leta 1363. Po njej je gora dobila ime.",
    allowPhoto: true,
  },
  {
    id: "poi-2",
    name: "Dom na Uršlji gori",
    category: "koca",
    lat: 46.48473,
    lng: 14.96503,
    description:
      "Planinski dom na 1680 m nadmorske višine, tik pod vrhom. Pred domom klopi in mize z razgledom. Odprta ob vikendih in praznikih.",
    allowPhoto: true,
  },
  {
    id: "poi-3",
    name: "Koča na Naravskih ledinah",
    category: "koca",
    lat: 46.48644,
    lng: 14.93759,
    description:
      "Planinska koča na 1072 m. Izhodišče za pot na Uršljo goro (1h 45min). Ponuja domačo hrano in pijačo.",
  },
  {
    id: "poi-4",
    name: "Poštarski dom pod Plešivcem",
    category: "koca",
    lat: 46.49626,
    lng: 15.01281,
    description:
      "Planinski dom pod Plešivcem (1173 m). Izhodišče za pot na vrh čez Kozarnico (2h 30min) ali čez Kal (2h 45min).",
  },
  {
    id: "poi-5",
    name: "Andrejev dom na Slemenu",
    category: "koca",
    lat: 46.43815,
    lng: 14.96437,
    description:
      "Planinski dom na Slemenu (1087 m). Izhodišče za pot na Uršljo goro (2h 45min). Priljubljena izletniška točka.",
  },
  {
    id: "poi-6",
    name: "Oddajnik Plešivec",
    category: "oddajnik",
    lat: 46.485119,
    lng: 14.963674,
    description:
      "RTV oddajnik, postavljen leta 1962. Leži nad cerkvijo in planinsko kočo. Pokriva Koroško in Štajersko regijo.",
    allowPhoto: true,
  },
  {
    id: "poi-7",
    name: "Vrh Uršlje gore — križ",
    category: "fotografija",
    lat: 46.48555,
    lng: 14.96149,
    description:
      "Vrh Uršlje gore (1699 m) z križem in razgledno ploščo. Najvzhodnejši vrh Karavank. Panoramski 360° razgled.",
    allowPhoto: true,
  },
  {
    id: "poi-8",
    name: "Ivarčko jezero",
    category: "fotografija",
    lat: 46.50606,
    lng: 14.97092,
    description:
      "Gorsko jezero pod Uršljo goro. Izhodišče Železarske poti in Grofovske poti na vrh.",
  },
  {
    id: "poi-9",
    name: "Planinski pohod na Uršljo goro",
    category: "dogodek",
    lat: 46.48473,
    lng: 14.96503,
    description:
      "Organiziran skupinski pohod na vrh Uršlje Gore. Vodeni izlet z izkušenim vodnikom, primeren za vse starosti.",
    date: "15. junij 2026",
  },
  {
    id: "poi-10",
    name: "Festival domače hrane",
    category: "dogodek",
    lat: 46.48473,
    lng: 14.96503,
    description:
      "Lokalni pridelovalci predstavijo domače specialitete — med, sir, suho meso, potica. Ob Domu na Uršlji gori.",
    date: "20. julij 2026",
  },
  {
    id: "poi-11",
    name: "Noč pod zvezdami",
    category: "dogodek",
    lat: 46.48555,
    lng: 14.96149,
    description:
      "Astronomski večer na vrhu Uršlje Gore. Opazovanje zvezd z vodenim predavanjem. Prinesite tople obleke!",
    date: "8. avgust 2026",
  },
  {
    id: "poi-12",
    name: "Gostilna Kotlje",
    category: "gostilna",
    lat: 46.51943,
    lng: 14.98558,
    description:
      "Priljubljena izletniška točka v vasi Kotlje ob vznožju Uršlje gore. Koroška kuhinja — štruklji, žganci, kislo mleko.",
  },
  {
    id: "poi-13",
    name: "Gostišče Žerjav",
    category: "gostilna",
    lat: 46.48271,
    lng: 14.86902,
    description:
      "Gostilna v nekdanjem rudarskem mestcu Žerjav. Izhodišče poti na Uršljo goro.",
  },
];
