import { describe, expect, it, beforeEach } from "vitest";
import { setupTests } from "@specs/vitest.setup";
import { init } from "@/assets/data";
import { parseClipboard } from "@/parser";

describe("Unique Spear Skysliver parse", () => {
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

  it("should parse Skysliver unique modifiers", () => {
    const result = parseClipboard(skysliverText);
    expect(result.isOk()).toBe(true);

    const item = result._unsafeUnwrap();
    console.log("=== Parsed Item ===");
    console.log("category:", item.category);
    console.log("rarity:", item.rarity);
    console.log("name:", item.name);
    console.log("baseType:", item.baseType);
    console.log("info.refName:", item.info?.refName);
    console.log("weaponPHYSICAL:", item.weaponPHYSICAL);
    console.log("weaponLIGHTNING:", item.weaponLIGHTNING);
    console.log("weaponELEMENTAL:", item.weaponELEMENTAL);
    console.log("weaponAS:", item.weaponAS);
    console.log("weaponCRIT:", item.weaponCRIT);
    console.log("quality:", item.quality);
    console.log("isCorrupted:", item.isCorrupted);
    console.log("newMods count:", item.newMods.length);
    console.log("unknownModifiers count:", item.unknownModifiers.length);
    
    console.log("\n=== Modifiers ===");
    for (let i = 0; i < item.newMods.length; i++) {
      const mod = item.newMods[i];
      console.log(`Mod ${i}: type=${mod.info.type}, generation=${mod.info.generation}, stats=${mod.stats.length}`);
      for (const stat of mod.stats) {
        console.log(`  stat: ref=${stat.stat?.ref}, roll=${JSON.stringify(stat.roll)}`);
      }
    }
    
    console.log("\n=== Unknown Modifiers ===");
    for (const um of item.unknownModifiers) {
      console.log(`  unknown: type=${um.type}, text="${um.text}"`);
    }

    console.log("\n=== statsByType ===");
    for (const calc of item.statsByType) {
      console.log(`  calc: ref=${calc.stat.ref}, type=${calc.type}, sources=${calc.sources.length}`);
      for (const src of calc.sources) {
        console.log(`    source contributes: ${JSON.stringify(src.contributes)}`);
      }
    }

    expect(item.info.refName).toBe("Skysliver");
    expect(item.isCorrupted).toBe(true);
    expect(item.weaponAS).toBe(2.33);
    expect(item.weaponCRIT).toBe(5.0);
    expect(item.quality).toBe(20);
  });
});
