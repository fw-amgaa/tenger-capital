/**
 * Vercel header `x-vercel-ip-country-region` returns ISO 3166-2 subdivision
 * codes (without the country prefix). For Mongolia these resolve to numeric
 * codes used by MaxMind. This map covers Ulaanbaatar + 21 aimags.
 */
export const MONGOLIA_REGIONS: Record<string, string> = {
  "1": "Улаанбаатар",
  "035": "Орхон",
  "037": "Дархан-Уул",
  "039": "Хэнтий",
  "041": "Хөвсгөл",
  "043": "Ховд",
  "046": "Увс",
  "047": "Төв",
  "049": "Сэлэнгэ",
  "051": "Сүхбаатар",
  "053": "Өмнөговь",
  "055": "Өвөрхангай",
  "057": "Завхан",
  "059": "Дундговь",
  "061": "Дорнод",
  "063": "Дорноговь",
  "064": "Говьсүмбэр",
  "065": "Говь-Алтай",
  "067": "Булган",
  "069": "Баянхонгор",
  "071": "Баян-Өлгий",
  "073": "Архангай",
};

export function mongoliaRegionLabel(code: string | null | undefined): string {
  if (!code) return "Тодорхойгүй";
  return MONGOLIA_REGIONS[code] ?? code;
}

/**
 * Tile-map layout for a 7-column grid (column, row), rough geography.
 * UB is a special highlighted tile.
 */
export const MN_TILE_MAP: Record<string, { col: number; row: number; emphasis?: boolean }> = {
  "071": { col: 1, row: 1 }, // Bayan-Ölgii (NW corner)
  "046": { col: 2, row: 1 }, // Uvs
  "041": { col: 3, row: 1 }, // Khövsgöl
  "067": { col: 4, row: 1 }, // Bulgan
  "049": { col: 5, row: 1 }, // Selenge
  "037": { col: 6, row: 1 }, // Darkhan-Uul
  "061": { col: 7, row: 1 }, // Dornod (NE)

  "043": { col: 1, row: 2 }, // Khovd
  "057": { col: 2, row: 2 }, // Dzavkhan
  "073": { col: 3, row: 2 }, // Arkhangai
  "035": { col: 4, row: 2 }, // Orkhon
  "047": { col: 5, row: 2 }, // Töv
  "039": { col: 6, row: 2 }, // Khentii
  "051": { col: 7, row: 2 }, // Sükhbaatar

  "065": { col: 1, row: 3 }, // Govi-Altai
  "069": { col: 2, row: 3 }, // Bayankhongor
  "055": { col: 3, row: 3 }, // Övörkhangai
  "1": { col: 4, row: 3, emphasis: true }, // Ulaanbaatar (center, special)
  "059": { col: 5, row: 3 }, // Dundgovi
  "064": { col: 6, row: 3 }, // Govi-Sümber
  "063": { col: 7, row: 3 }, // Dornogovi

  "053": { col: 4, row: 4 }, // Ömnögovi (south)
};

export function mongoliaTilePositions(): {
  code: string;
  name: string;
  col: number;
  row: number;
  emphasis?: boolean;
}[] {
  return Object.entries(MN_TILE_MAP).map(([code, pos]) => ({
    code,
    name: MONGOLIA_REGIONS[code] ?? code,
    ...pos,
  }));
}

/** Country code → emoji flag. */
export function flagEmoji(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 0x1f1a5 + c.charCodeAt(0)),
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  MN: "Монгол",
  US: "Америк",
  KR: "Солонгос",
  JP: "Япон",
  CN: "Хятад",
  RU: "Орос",
  DE: "Герман",
  GB: "Их Британи",
  FR: "Франц",
  CA: "Канад",
  AU: "Австрали",
  KZ: "Казахстан",
  TR: "Турк",
  IN: "Энэтхэг",
  HK: "Хонгконг",
  SG: "Сингапур",
};

export function countryName(code: string | null | undefined): string {
  if (!code) return "Тодорхойгүй";
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}
