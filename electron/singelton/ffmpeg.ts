import { join, dirname } from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function () {
  let ffmpegPath;

  if (process.env.NODE_ENV === "development") {
    // In dev, reference FFmpeg from the root `bin/` folder
    ffmpegPath = join(__dirname, "../bin/ffmpeg.exe");
  } else {
    // In production, use Electron's `process.resourcesPath`
    ffmpegPath = join(process.resourcesPath, "bin", "ffmpeg.exe");
  }

  ffmpeg.setFfmpegPath(ffmpegPath);
  return ffmpeg()
}
