import JSZip from "jszip";
import { buildCharacterWorkbook } from "./exportFormatters";

const safeName = (name) =>
  (name || "Unnamed Character")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60) || "Character";

const README = `WITCHES & SNITCHES — YOUR CHARACTER BACKUP
==========================================

NOTE: The player who built and hosted this character website has decided to
leave the campaign and has chosen to take the site down soon. This backup makes
sure you keep a complete copy of all your characters before it goes offline.

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

Folder layout (after unzipping):
  /Active/<Character Name>.xlsx     ← your currently-active characters
  /Inactive/<Character Name>.xlsx   ← your archived (inactive) characters

Keep this zip somewhere safe. Nothing here depends on the website staying
online. Thanks for playing.
`;

/**
 * Build a downloadable ZIP Blob containing one Excel workbook (.xlsx) per
 * character plus a README.
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

  const groups = data.groups || [{ folder: null, bundles: data.characters }];
  const total = groups.reduce((n, g) => n + g.bundles.length, 0) || 1;
  let processed = 0;

  for (const group of groups) {
    const parent = group.folder ? zip.folder(group.folder) : zip;
    const usedNames = new Set();

    for (let i = 0; i < group.bundles.length; i++) {
      const bundle = group.bundles[i];
      const character = bundle.character;

      let fileName = safeName(character.name);
      let suffix = 2;
      while (usedNames.has(fileName.toLowerCase())) {
        fileName = `${safeName(character.name)} (${suffix++})`;
      }
      usedNames.add(fileName.toLowerCase());

      report(
        `Packaging ${character.name || "character"} (${processed + 1}/${total})…`,
        0.7 + (0.25 * processed) / total
      );

      // Excel workbook — the only file included in the export.
      try {
        parent.file(`${fileName}.xlsx`, buildCharacterWorkbook(bundle));
      } catch (err) {
        console.warn(`[export] Workbook failed for ${character.name}:`, err);
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
