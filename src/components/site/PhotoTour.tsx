import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { brands } from "@/data/studio";
import { Link } from "@/lib/router";

const RING = 9; // radius of each brand's photo ring
const ORBIT = 2.5; // radius of the camera path inside a ring
const SPACING = 70; // distance between brand rooms (fog hides the gap)
const HEADER = 73; // sticky header height, px

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Frame({ url, index, count, cx }: { url: string; index: number; count: number; cx: number }) {
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let live = true;
    loader.load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        if (live) setMap(t);
      },
      undefined,
      () => {}, // keep the sky-blue placeholder if the photo can't load
    );
    return () => {
      live = false;
    };
  }, [url]);

  const a = (index / count) * Math.PI * 2;
  return (
    <mesh
      position={[cx + Math.cos(a) * RING, Math.sin(index * 1.7) * 1.2, Math.sin(a) * RING]}
      rotation={[0, -a - Math.PI / 2, 0]}
    >
      <planeGeometry args={[4.4, 5.5]} />
      <meshBasicMaterial map={map} color={map ? "#ffffff" : "#b8cedd"} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Rig({ progress, onBrand }: { progress: React.RefObject<number>; onBrand: (i: number) => void }) {
  const cur = useRef(0);
  const shown = useRef(0);
  const target = useRef(new THREE.Vector3());
  useFrame(({ camera, clock }) => {
    cur.current += (progress.current - cur.current) * 0.06;
    const f = cur.current * brands.length; // 0..brands.length
    const i = Math.min(brands.length - 1, Math.floor(f));
    const u = f - i; // position inside this brand's segment

    // Stay in a brand's room, then fly to the next one at the end of its segment.
    const fly = i < brands.length - 1 ? smooth(0.82, 1, u) : 0;
    const cx = (i + fly) * SPACING;
    const drift = reduced() ? 0 : clock.elapsedTime * 0.05;
    const a = f * Math.PI * 1.1 + drift;

    camera.position.set(cx + Math.cos(a) * ORBIT, Math.sin(f * 7) * 0.6, Math.sin(a) * ORBIT);
    // The look direction sweeps across this brand's photos so the angle keeps changing.
    const look = a + 0.9 + Math.sin(f * 9) * 0.9;
    target.current.set(cx + Math.cos(look) * RING, Math.sin(f * 5) * 1.4, Math.sin(look) * RING);
    camera.lookAt(target.current);
    camera.rotateZ(Math.sin(f * 8) * 0.05);

    const current = fly > 0.5 ? i + 1 : i;
    if (current !== shown.current) {
      shown.current = current;
      onBrand(current);
    }
  });
  return null;
}

export default function PhotoTour() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [brand, setBrand] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      progress.current = Math.min(0.9999, Math.max(0, -r.top / span));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const b = brands[brand];
  // Keep the previous brand around so its name can drift away as the new one condenses in.
  const [leaving, setLeaving] = useState<(typeof brands)[number] | null>(null);
  const shown = useRef(b);
  useEffect(() => {
    if (shown.current === b) return;
    setLeaving(shown.current);
    shown.current = b;
    const t = window.setTimeout(() => setLeaving(null), 900);
    return () => window.clearTimeout(t);
  }, [b]);
  return (
    <section
      ref={wrap}
      aria-label="Brand interiors tour"
      style={{ height: `${brands.length * 260}vh` }}
      className="relative bg-powder"
    >
      <div
        style={{ top: HEADER, height: `calc(100vh - ${HEADER}px)` }}
        className="sticky overflow-hidden"
      >
        <Canvas camera={{ fov: 60, near: 0.1, far: 40 }} dpr={[1, 1.75]} aria-hidden>
          <color attach="background" args={["#eaf2f7"]} />
          <fog attach="fog" args={["#eaf2f7", 8, 22]} />
          {brands.map((br, bi) =>
            br.photos.map((url, pi) => (
              <Frame key={url} url={url} index={pi} count={br.photos.length} cx={bi * SPACING} />
            )),
          )}
          <Rig progress={progress} onBrand={setBrand} />
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-powder via-powder/70 to-transparent px-6 pb-10 pt-24">
          <div aria-live="polite" className="relative">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-stone">
              {String(brand + 1).padStart(2, "0")} / {String(brands.length).padStart(2, "0")}
            </p>
            {leaving && (
              <div aria-hidden key={`out-${leaving.name}`} className="smoke-out absolute inset-x-0 top-7">
                <p className="font-display text-5xl text-slate md:text-8xl">{leaving.name}</p>
                <p className="mt-2 text-sm text-stone">{leaving.note}</p>
              </div>
            )}
            <div key={b.name} className="smoke-in">
              <p className="font-display text-5xl text-slate md:text-8xl">{b.name}</p>
              <p className="mt-2 text-sm text-stone">{b.note}</p>
            </div>
          </div>
          <Link
            to="/work"
            className="pointer-events-auto hidden bg-slate px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-porcelain transition-colors hover:bg-slate/85 md:inline-block"
          >
            View projects
          </Link>
        </div>
        <p className="pointer-events-none absolute right-6 top-6 text-[11px] uppercase tracking-[0.28em] text-stone">
          Scroll
        </p>
      </div>
    </section>
  );
}
