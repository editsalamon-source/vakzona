import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

// Csak a helyi fejlesztői szerveren: az Akadémia videóinak kiszolgálása a gitignore-olt munkamappából
// (/akademia-helyi/<url-azonosító>/<fájl> → Akadémia/<url-azonosító>/videok/<fájl>), Range-kéréssel a tekeréshez.
// Élesben a videók külső tárhelyről jönnek, ez az út ott nem létezik.
const TYPES = { ".mp4": "video/mp4", ".webm": "video/webm", ".vtt": "text/vtt" };

function localVideos() {
  return {
    name: "akademia-helyi-videok",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/akademia-helyi", (req, res, next) => {
        const [slug, ...rest] = decodeURIComponent(req.url.split("?")[0]).split("/").filter(Boolean);
        const base = join(import.meta.dirname, "Akadémia", slug || "", "videok");
        const file = normalize(join(base, ...rest));
        if (!slug || !file.startsWith(base) || !existsSync(file)) return next();
        const size = statSync(file).size;
        const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
        res.setHeader("Content-Type", TYPES[extname(file).toLowerCase()] || "application/octet-stream");
        res.setHeader("Accept-Ranges", "bytes");
        if (!range) {
          res.setHeader("Content-Length", size);
          return createReadStream(file).pipe(res);
        }
        const start = range[1] ? Number(range[1]) : size - Number(range[2]);
        const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
        res.statusCode = 206;
        res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
        res.setHeader("Content-Length", end - start + 1);
        createReadStream(file, { start, end }).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localVideos()],
  // az oklevél PDF-éhez (csak letöltéskor, dinamikusan töltődnek be)
  optimizeDeps: { include: ["html-to-image", "jspdf"] },
});
