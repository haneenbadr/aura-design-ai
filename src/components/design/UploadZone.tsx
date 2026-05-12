import { Upload, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

export function UploadZone({
  files,
  onChange,
}: {
  files: { url: string; name: string }[];
  onChange: (files: { url: string; name: string }[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 6 - files.length).map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    onChange([...files, ...next]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={[
          "cursor-pointer rounded-3xl border-2 border-dashed transition-all p-10 text-center bg-card/60",
          drag ? "border-gold bg-gold/10 scale-[1.01]" : "border-border hover:border-gold/60 hover:bg-secondary/40",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="size-16 mx-auto rounded-2xl bg-gradient-wood grid place-items-center shadow-soft mb-4">
          <Upload className="size-7 text-primary-foreground" />
        </div>
        <p className="font-bold text-lg">اسحب الصور هنا أو اضغط للرفع</p>
        <p className="text-sm text-muted-foreground mt-1">
          صور غرفتك الحالية أو مراجع الإلهام • حتى ٦ صور • PNG, JPG
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 animate-fade-up">
          {files.map((f, i) => (
            <div key={f.url} className="group relative aspect-square rounded-xl overflow-hidden shadow-soft">
              <img src={f.url} alt={f.name} className="size-full object-cover" />
              <button
                onClick={() => onChange(files.filter((_, k) => k !== i))}
                className="absolute top-1.5 left-1.5 size-7 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80 hover:text-destructive-foreground"
                aria-label="حذف"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {files.length < 6 && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-gold/60 grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ImagePlus className="size-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
