import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, TransformControls } from "@react-three/drei";
import { Suspense, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Vector2, type Group, type Scene, type WebGLRenderer, type PerspectiveCamera } from "three";
import { FURNITURE, type PlacedItem } from "./furniture";

export interface Scene3DHandle {
  exportPNG: (scale?: number) => Promise<void>;
  exportGLB: () => Promise<void>;
}

type TransformMode = "translate" | "rotate";

interface Props {
  items: PlacedItem[];
  setItems?: (next: PlacedItem[]) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  /** Canvas pixel size used in 2D — used to size the room. */
  roomPxWidth?: number;
  roomPxHeight?: number;
}

const PX_PER_M = 100;

// Map furniture id -> 3D dimensions in meters (w, h, d) and color hex
const META: Record<string, { h: number; color: string; kind?: "lamp" | "tv" | "plant" }> = {
  "sofa-3":     { h: 0.85, color: "#6b4a2b" },
  "armchair":   { h: 0.85, color: "#7b5638" },
  "bed-q":      { h: 0.55, color: "#8a6a4a" },
  "coffee":     { h: 0.42, color: "#a78b6a" },
  "side":       { h: 0.5,  color: "#a78b6a" },
  "lamp-floor": { h: 1.55, color: "#c9a84c", kind: "lamp" },
  "lamp-table": { h: 0.45, color: "#c9a84c", kind: "lamp" },
  "tv":         { h: 0.7,  color: "#1a1a1a", kind: "tv" },
  "shelf":      { h: 1.6,  color: "#5b3d24" },
  "plant":      { h: 0.9,  color: "#3f6b3a", kind: "plant" },
};

const Furniture = forwardRef<Group, {
  item: PlacedItem;
  onSelect: () => void;
  isSelected: boolean;
  roomW: number;
  roomD: number;
}>(function Furniture({ item, onSelect, isSelected, roomW, roomD }, ref) {
  const def = FURNITURE.find((f) => f.id === item.itemId);
  if (!def) return null;
  const meta = META[item.itemId] ?? { h: 0.6, color: "#8a6a4a" };

  // size (m)
  const w = def.width / PX_PER_M;
  const d = def.height / PX_PER_M;
  const h = meta.h;

  // position: center in room. 2D origin (0,0) is top-left of canvas.
  const x = item.x / PX_PER_M - roomW / 2;
  const z = item.y / PX_PER_M - roomD / 2;

  return (
    <group
      ref={ref}
      position={[x, 0, z]}
      rotation={[0, (-item.rotation * Math.PI) / 180, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {meta.kind === "lamp" ? (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, h, 16]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
          <mesh position={[0, h, 0]} castShadow>
            <coneGeometry args={[0.22, 0.3, 24]} />
            <meshStandardMaterial color={meta.color} emissive="#f5d27a" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[0, h - 0.05, 0]} intensity={0.6} distance={3} color="#ffd9a0" />
        </group>
      ) : meta.kind === "plant" ? (
        <group>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.3, 16]} />
            <meshStandardMaterial color="#6b4a2b" />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color={meta.color} roughness={0.9} />
          </mesh>
        </group>
      ) : meta.kind === "tv" ? (
        <group>
          <mesh position={[0, h, 0]} castShadow>
            <boxGeometry args={[w, 0.55, 0.08]} />
            <meshStandardMaterial color={meta.color} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, h, 0.045]}>
            <planeGeometry args={[w * 0.92, 0.5]} />
            <meshStandardMaterial color="#0a3a5a" emissive="#1e6b9c" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={meta.color} roughness={0.7} />
        </mesh>
      )}

      {isSelected && (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.55, Math.max(w, d) * 0.62, 48]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
});

function Room({ w, d }: { w: number; d: number }) {
  const wallH = 2.7;
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#d8c5a8" roughness={0.85} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, wallH / 2, -d / 2]} receiveShadow>
        <planeGeometry args={[w, wallH]} />
        <meshStandardMaterial color="#f1e7d3" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-w / 2, wallH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[d, wallH]} />
        <meshStandardMaterial color="#ece1cc" />
      </mesh>
      {/* Right wall (slightly transparent for visibility) */}
      <mesh position={[w / 2, wallH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[d, wallH]} />
        <meshStandardMaterial color="#ece1cc" transparent opacity={0.15} />
      </mesh>
      {/* Carpet */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w * 0.55, d * 0.55]} />
        <meshStandardMaterial color="#b89770" roughness={1} />
      </mesh>
    </group>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ExportBridge({
  registerHandle,
}: {
  registerHandle: (h: { gl: WebGLRenderer; scene: Scene; camera: PerspectiveCamera }) => void;
}) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    registerHandle({ gl, scene, camera: camera as PerspectiveCamera });
  }, [gl, scene, camera, registerHandle]);
  return null;
}

export const Scene3D = forwardRef<Scene3DHandle, Props>(function Scene3D(
  { items, setItems, selected, setSelected, roomPxWidth = 760, roomPxHeight = 500 },
  ref,
) {
  const roomW = useMemo(() => roomPxWidth / PX_PER_M, [roomPxWidth]);
  const roomD = useMemo(() => roomPxHeight / PX_PER_M, [roomPxHeight]);
  const sceneApi = useRef<{ gl: WebGLRenderer; scene: Scene; camera: PerspectiveCamera } | null>(null);
  const refs = useRef<Map<string, Group>>(new Map());
  const [transforming, setTransforming] = useState(false);
  const [mode, setMode] = useState<TransformMode>("translate");
  const selectedObj = selected ? refs.current.get(selected) : null;

  useImperativeHandle(ref, () => ({
    exportPNG: async (scale = 2) => {
      const api = sceneApi.current;
      if (!api) return;
      const { gl, scene, camera } = api;
      const size = new Vector2();
      gl.getSize(size);
      const pr = gl.getPixelRatio();
      try {
        gl.setPixelRatio(scale * pr);
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL("image/png");
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        downloadBlob(blob, `dari-3d-${Date.now()}.png`);
      } finally {
        gl.setPixelRatio(pr);
        gl.setSize(size.x, size.y, false);
        gl.render(scene, camera);
      }
    },
    exportGLB: async () => {
      const api = sceneApi.current;
      if (!api) return;
      const exporter = new GLTFExporter();
      const result = await new Promise<ArrayBuffer>((resolve, reject) => {
        exporter.parse(
          api.scene,
          (out) => resolve(out as ArrayBuffer),
          (err) => reject(err),
          { binary: true },
        );
      });
      downloadBlob(new Blob([result], { type: "model/gltf-binary" }), `dari-3d-${Date.now()}.glb`);
    },
  }));

  const commitTransform = () => {
    if (!selected || !setItems) return;
    const obj = refs.current.get(selected);
    if (!obj) return;
    const newX = (obj.position.x + roomW / 2) * PX_PER_M;
    const newY = (obj.position.z + roomD / 2) * PX_PER_M;
    const newRot = (-obj.rotation.y * 180) / Math.PI;
    setItems(items.map((it) => it.uid === selected ? { ...it, x: newX, y: newY, rotation: newRot } : it));
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-border relative bg-gradient-to-b from-[hsl(35,30%,92%)] to-[hsl(30,25%,82%)]">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [roomW * 0.9, roomW * 0.7, roomD * 0.9], fov: 45 }}
        onPointerMissed={() => { if (!transforming) setSelected(null); }}
      >
        <Suspense fallback={<Html center><div className="text-xs text-muted-foreground">جاري تحميل المشهد...</div></Html>}>
          <ExportBridge registerHandle={(h) => { sceneApi.current = h; }} />
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />
          <Room w={roomW} d={roomD} />
          {items.map((it) => (
            <Furniture
              key={it.uid}
              ref={(g) => {
                if (g) refs.current.set(it.uid, g);
                else refs.current.delete(it.uid);
              }}
              item={it}
              isSelected={selected === it.uid}
              onSelect={() => setSelected(it.uid)}
              roomW={roomW}
              roomD={roomD}
            />
          ))}
          {selectedObj && setItems && (
            <TransformControls
              object={selectedObj}
              mode={mode}
              showY={mode === "rotate"}
              translationSnap={0.1}
              rotationSnap={Math.PI / 24}
              onMouseDown={() => setTransforming(true)}
              onMouseUp={() => { setTransforming(false); commitTransform(); }}
              onObjectChange={() => { /* live update on release */ }}
            />
          )}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={Math.max(roomW, roomD) * 1.5} blur={2.4} far={3} />
          <Environment preset="apartment" />
          <OrbitControls
            makeDefault
            enabled={!transforming}
            target={[0, 0.8, 0]}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={3}
            maxDistance={20}
            enableDamping
          />
        </Suspense>
      </Canvas>

      {/* Transform mode switcher */}
      {selected && setItems && (
        <div className="absolute top-3 right-3 glass rounded-xl p-1 flex gap-1 shadow-soft">
          <button
            onClick={() => setMode("translate")}
            className={`px-3 h-8 rounded-lg text-xs font-semibold ${mode === "translate" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
          >
            تحريك
          </button>
          <button
            onClick={() => setMode("rotate")}
            className={`px-3 h-8 rounded-lg text-xs font-semibold ${mode === "rotate" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
          >
            تدوير
          </button>
        </div>
      )}

      <div className="absolute top-3 left-3 glass rounded-lg px-3 py-1.5 text-[11px] text-muted-foreground pointer-events-none">
        اسحب للتدوير • مرر للتكبير • انقر قطعة لتحريكها
      </div>
    </div>
  );
});

