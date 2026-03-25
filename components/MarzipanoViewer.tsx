"use client";

import { useEffect, useRef } from "react";

type MarzipanoViewerProps = {
  imageUrl: string;
};

export default function MarzipanoViewer({
  imageUrl,
}: MarzipanoViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    const container = viewerRef.current;

    async function init() {
      if (!container) return;

      const { default: Marzipano } = await import("marzipano");
      if (destroyed) return;

      container.innerHTML = "";

      const viewer = new Marzipano.Viewer(container);
      const source = Marzipano.ImageUrlSource.fromString(imageUrl);
      const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

      const limiter = Marzipano.RectilinearView.limit.traditional(
        1024,
        (120 * Math.PI) / 180
      );

      const view = new Marzipano.RectilinearView(null, limiter);

      const scene = viewer.createScene({
        source,
        geometry,
        view,
      });

      scene.switchTo();
    }

    init();

    return () => {
      destroyed = true;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100%" }} />;
}
