"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "./api";

type ContentState = { data: any | null; loading: boolean; failed: boolean };
const collections = { novica: "novicas", dogodek: "dogodkis", ponudba: "ponudbes" };
type ContentKey = keyof typeof collections;
const initial = (): Record<ContentKey, ContentState> => ({
  novica: { data: null, loading: true, failed: false },
  dogodek: { data: null, loading: true, failed: false },
  ponudba: { data: null, loading: true, failed: false },
});

export function useFeaturedContent() {
  const [content, setContent] = useState(initial);
  useEffect(() => {
    let active = true;
    for (const key of Object.keys(collections) as ContentKey[]) {
      // Published CMS documents only; a newly published entry replaces the old feature.
      fetchAPI(`${collections[key]}?populate=*&status=published&sort=publishedAt:desc&pagination[pageSize]=1`)
        .then(res => {
          if (active) setContent(current => ({ ...current, [key]: { data: res.data?.[0] ?? null, loading: false, failed: false } }));
        })
        .catch(() => {
          if (active) setContent(current => ({ ...current, [key]: { data: null, loading: false, failed: true } }));
        });
    }
    return () => { active = false; };
  }, []);
  return content;
}
