from pathlib import Path
import subprocess, json
root = Path(__file__).resolve().parents[1]
manifest = {}
for name in ["stethoscope", "consultation", "guidance", "care", "team"]:
    output = root / "public" / "frames" / name
    output.mkdir(parents=True, exist_ok=True)
    for existing in output.glob("*.webp"):
        existing.unlink()
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(root / "assets" / "videos" / (name + ".mp4")), "-vf", "fps=12,scale=1280:-1", "-c:v", "libwebp", "-quality", "78", "-threads", "2", str(output / "%03d.webp")], check=True)
    manifest[name] = {"count": len(list(output.glob("*.webp"))), "width": 1280, "height": 720}
    print(name, manifest[name]["count"], "frames", flush=True)
(root / "public" / "frames" / "manifest.json").write_text(json.dumps(manifest, indent=2))
