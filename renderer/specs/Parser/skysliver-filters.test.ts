import { describe, expect, it, beforeEach } from "vitest";
import { setupTests } from "@specs/vitest.setup";
import { init } from "@/assets/data";
import { parseClipboard } from "@/parser";
import { initUiModFilters } from "@/web/price-check/filters/create-stat-filters";

describe("Skysliver price-check filters", () => {
  beforeEach(async () => {
    setupTests();
    await init("en");
  });

  const skysliverText = `Item Class: Spears
Rarity: Unique
Skysliver
Winged Spear
--------
Quality: +20% (augmented)
Lightning Damage: 1 or 115 (lightning)
Critical Hit Chance: 5.00%
Attacks per Second: 2.33 (augmented)
--------
Requires: Level 16, 12 Str, 25 Dex
--------
Sockets: S S 
--------
Item Level: 79
--------
10% increased Attack Speed (rune)
--------
Grants Skill: Spear Throw
--------
{ Unique Modifier — Damage, Physical, Attack }
No Physical Damage
{ Unique Modifier — Damage, Elemental, Lightning, Attack }
Adds 1 to 115(80-120) Lightning Damage
{ Unique Modifier — Attack, Speed }
27(15-30)% increased Attack Speed
{ Unique Modifier — Elemental, Lightning, Ailment }
99(50-100)% increased chance to Shock
{ Unique Modifier — Damage }
Rolls only the minimum or maximum Damage value for each Damage Type — Unscalable Value
--------
Heads fall to the sand, just as the star fell from the sky
--------
Corrupted
`;

  it("should have all unique modifiers visible in price-check filters", () => {
    const result = parseClipboard(skysliverText);
    expect(result.isOk()).toBe(true);
    const item = result._unsafeUnwrap();

    const filters = initUiModFilters(item, { searchStatRange: 10, defaultAllSelected: false });

    console.log("=== Price-check UI Filters ===");
    for (const f of filters) {
      console.log(`tag=${f.tag}, ref="${f.statRef}", disabled=${f.disabled}, hidden=${f.hidden ?? "null"}`);
    }

    // Check all 5 unique modifiers are present and visible
    const noPhys = filters.find(f => f.statRef === "#% increased Physical Damage" && f.tag === "explicit");
    const addsLightning = filters.find(f => f.statRef === "Adds # to # Lightning Damage" && f.tag === "explicit");
    const ias = filters.find(f => f.statRef === "#% increased Attack Speed" && f.tag === "explicit");
    const shock = filters.find(f => f.statRef === "#% increased chance to Shock");
    const rollMinMax = filters.find(f => f.statRef.includes("minimum or maximum Damage"));

    console.log("\n=== Unique Mods in Price-check Filters ===");
    console.log("No Physical Damage:", noPhys ? `FOUND (disabled=${noPhys.disabled}, hidden=${noPhys.hidden})` : "MISSING");
    console.log("Adds Lightning:", addsLightning ? `FOUND (disabled=${addsLightning.disabled}, hidden=${addsLightning.hidden})` : "MISSING");
    console.log("IAS:", ias ? `FOUND (disabled=${ias.disabled}, hidden=${ias.hidden})` : "MISSING");
    console.log("Shock:", shock ? `FOUND (disabled=${shock.disabled}, hidden=${shock.hidden})` : "MISSING");
    console.log("Roll min/max:", rollMinMax ? `FOUND (disabled=${rollMinMax.disabled}, hidden=${rollMinMax.hidden})` : "MISSING");

    expect(noPhys).toBeDefined();
    expect(addsLightning).toBeDefined();
    expect(ias).toBeDefined();
    expect(shock).toBeDefined();
    expect(rollMinMax).toBeDefined();

    // Verify they are not hidden
    expect(noPhys!.hidden).toBeUndefined();
    expect(addsLightning!.hidden).toBeUndefined();
    expect(ias!.hidden).toBeUndefined();
    expect(shock!.hidden).toBeUndefined();
    expect(rollMinMax!.hidden).toBeUndefined();
  });
});
