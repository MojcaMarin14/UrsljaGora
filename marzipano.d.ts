declare module "marzipano" {
  export interface EquirectLevel {
    width: number;
    height?: number;
    tileWidth?: number;
    tileHeight?: number;
    fallbackOnly?: boolean;
  }

  export interface SceneOptions {
    source: unknown;
    geometry: EquirectGeometry;
    view: RectilinearView;
  }

  export class Viewer {
    constructor(element: HTMLElement, opts?: unknown);
    createScene(options: SceneOptions): Scene;
  }

  export class Scene {
    switchTo(opts?: unknown): void;
  }

  export class ImageUrlSource {
    static fromString(url: string, opts?: unknown): ImageUrlSource;
  }

  export class EquirectGeometry {
    constructor(levels: EquirectLevel[]);
  }

  export class RectilinearView {
    constructor(params?: unknown, limiter?: unknown);
    static limit: {
      traditional(resolution: number, maxFov: number): unknown;
    };
  }

  const Marzipano: {
    Viewer: typeof Viewer;
    ImageUrlSource: typeof ImageUrlSource;
    EquirectGeometry: typeof EquirectGeometry;
    RectilinearView: typeof RectilinearView;
  };

  export default Marzipano;
}
