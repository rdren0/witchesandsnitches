import JSZip from "jszip";
import { buildCharacterWorkbook, buildCharacterPdf } from "./exportFormatters";

const safeName = (name) =>
  (name || "Unnamed Character")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60) || "Character";

const extFromUrl = (url) => {
  const match = /\.(png|jpe?g|webp|gif)(\?|$)/i.exec(url || "");
  return match ? match[1].toLowerCase() : "png";
};

const blobToDataUrl = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });

// Read an image's natural dimensions via a blob URL (no CORS tainting).
const imageSize = (blob) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

const README = `WITCHES & SNITCHES — YOUR CHARACTER BACKUP
==========================================

NOTE: The player who built and hosted this character website has decided to
leave the campaign and has chosen to take the site down soon. This backup makes
sure you keep a complete copy of all your characters before it goes offline.

This archive contains everything the website had stored for your characters.

FIRST: UNZIP THIS FILE
----------------------
This is a .zip file. You can't open the files inside until you unzip
(extract) it first:
  • Windows: right-click the .zip and choose "Extract All".
  • Mac: double-click the .zip.
  • Phone/tablet: use a free Files or "unzip" app.
You cannot open a .zip (or the files inside it) directly in Google Docs.

OPENING THE FILES
-----------------
  • The .xlsx files are spreadsheets. Open them in Excel, Apple Numbers, or
    Google SHEETS (not Google Docs). In Google Drive, upload the .xlsx, then
    right-click it and choose "Open with → Google Sheets". Each character's
    workbook has tabs for their summary, ability scores, inventory, spells,
    downtime, and notes.

  • The .pdf files are printable character sheets — open them in any web
    browser or PDF reader. Great for handing to a new game or just keeping.

  • Each character also has a portrait image (if one was uploaded) and a
    .json file, which is the exact raw data. The .json is mainly useful if a
    developer ever needs to re-import your character somewhere — you can
    ignore it otherwise.

Folder layout (after unzipping):
  /Active/<Character Name>/     ← your currently-active characters
      <Character Name>.xlsx   ← readable spreadsheet (open in Excel/Sheets)
      <Character Name>.pdf    ← printable character sheet
      <Character Name>.json   ← complete raw data
      portrait.<ext>          ← character art, if any
  /Inactive/<Character Name>/   ← your archived (inactive) characters
      (same files as above)
  account.json                ← your profile + owl mail

Keep this zip somewhere safe. Nothing here depends on the website staying
online. Thanks for playing.
`;

/**
 * Build a downloadable ZIP Blob containing every character (xlsx + pdf + json +
 * portrait) plus account-level data and a README.
 *
 * Characters may be organized into named groups (e.g. "Active" / "Inactive"),
 * each becoming a top-level folder inside the zip. Pass `data.groups` as an
 * array of `{ folder, bundles }`. If omitted, `data.characters` is placed flat
 * at the zip root.
 *
 * @param {object} data            Result of gatherUserData(), optionally with
 *                                 a `groups` array.
 * @param {function} [onProgress]  (message, fraction 0-1) => void
 * @returns {Promise<Blob>}
 */
export const buildExportZip = async (data, onProgress) => {
  const report = (message, fraction) => onProgress?.(message, fraction);
  const zip = new JSZip();

  zip.file("README.txt", README);
  zip.file("account.json", JSON.stringify(data.account, null, 2));

  const groups = data.groups || [{ folder: null, bundles: data.characters }];
  const total = groups.reduce((n, g) => n + g.bundles.length, 0) || 1;
  let processed = 0;

  for (const group of groups) {
    const parent = group.folder ? zip.folder(group.folder) : zip;
    const usedNames = new Set();

    for (let i = 0; i < group.bundles.length; i++) {
      const bundle = group.bundles[i];
      const character = bundle.character;

      let folderName = safeName(character.name);
      let suffix = 2;
      while (usedNames.has(folderName.toLowerCase())) {
        folderName = `${safeName(character.name)} (${suffix++})`;
      }
      usedNames.add(folderName.toLowerCase());
      const folder = parent.folder(folderName);

      report(
        `Packaging ${character.name || "character"} (${processed + 1}/${total})…`,
        0.7 + (0.25 * processed) / total
      );

      // Raw JSON — always works, fully loss-less.
      folder.file(`${folderName}.json`, JSON.stringify(bundle, null, 2));

      // Excel workbook
      try {
        folder.file(`${folderName}.xlsx`, buildCharacterWorkbook(bundle));
      } catch (err) {
        console.warn(`[export] Workbook failed for ${character.name}:`, err);
      }

      // Portrait image (best effort — may be blocked by CORS). Fetched before
      // the PDF so it can be embedded on the page; also saved as a file.
      let portrait = null;
      const imageUrl = character.image_url || character.imageUrl;
      if (imageUrl) {
        try {
          const res = await fetch(imageUrl);
          if (res.ok) {
            const blob = await res.blob();
            const ext = extFromUrl(imageUrl);
            folder.file(`portrait.${ext}`, blob);
            // jsPDF only embeds PNG/JPEG; skip embedding others (still saved).
            if (/^(png|jpe?g)$/.test(ext)) {
              const dataUrl = await blobToDataUrl(blob);
              const size = await imageSize(blob);
              if (dataUrl) portrait = { dataUrl, ...(size || {}) };
            }
          }
        } catch (err) {
          console.warn(
            `[export] Could not fetch portrait for ${character.name}:`,
            err
          );
        }
      }

      // PDF sheet (with the portrait embedded when available)
      try {
        folder.file(`${folderName}.pdf`, buildCharacterPdf(bundle, portrait));
      } catch (err) {
        console.warn(`[export] PDF failed for ${character.name}:`, err);
      }

      processed++;
    }
  }

  report("Compressing archive…", 0.96);
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  report("Done", 1);
  return blob;
};

export const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
