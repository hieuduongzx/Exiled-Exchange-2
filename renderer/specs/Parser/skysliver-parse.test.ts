import { describe, expect, it, beforeEach } from "vitest";
import { setupTests } from "@specs/vitest.setup";
import { init } from "@/assets/data";
import { parseClipboard } from "@/parser";
import { initUiModFilters, FiltersCreationContext } from "@/web/price-check/filters/create-stat-filters";
import { filterPseudo } from "@/web/price-check/filters/pseudo";

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
    console.log("name:", item.info.refName);
    console.log("baseType:", item.info.unique?.base);
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

describe("Unique Ring The Taming parse", () => {
  beforeEach(async () => {
    setupTests();
    await init("en");
  });

  const tamingText = `Item Class: Rings
Rarity: Unique
The Taming
Prismatic Ring
--------
Quality (Fire Modifiers): +20% (augmented)
--------
Requires: Level 42
--------
Item Level: 80
--------
{ Implicit Modifier \u2014 Elemental, Fire, Cold, Lightning, Resistance \u2014 20% Increased }
+9(7-10)% to all Elemental Resistances
--------
{ Unique Modifier \u2014 Elemental, Fire, Cold, Lightning, Resistance \u2014 20% Increased }
+14(10-20)% to all Elemental Resistances
{ Unique Modifier \u2014 Elemental, Fire, Cold, Lightning \u2014 20% Increased }
13(10-20)% increased Damage for each type of Elemental Ailment on Enemy
{ Unique Modifier \u2014 Elemental }
Wind Skills which can be boosted by Elemental Ground Surfaces can be boosted by multiple Elemental Ground Surfaces \u2014 Unscalable Value
Wind Skills which can be boosted by Elemental Ground Surfaces count
as being boosted by Ignited, Shocked, and Chilled Ground \u2014 Unscalable Value
--------
"Moon after moon did Berek make fools
Of the great and Untamed Three
Until malice for a Brother
Slew the hatred of the Other
And Berek did hunt
Alone and free."
- Berek and the Untamed
--------
Corrupted`;

  it("should parse all The Taming unique modifiers including Wind Skills", () => {
    const result = parseClipboard(tamingText);
    expect(result.isOk()).toBe(true);

    const item = result._unsafeUnwrap();
    console.log("=== The Taming Parsed ===");
    console.log("category:", item.category);
    console.log("rarity:", item.rarity);
    console.log("info.refName:", item.info?.refName);
    console.log("newMods count:", item.newMods.length);
    console.log("unknownModifiers count:", item.unknownModifiers.length);

    console.log("\n=== Modifiers ===");
    for (let i = 0; i < item.newMods.length; i++) {
      const mod = item.newMods[i];
      console.log(`Mod ${i}: type=${mod.info.type}, generation=${mod.info.generation}, stats=${mod.stats.length}`);
      for (const stat of mod.stats) {
        console.log(`  stat: ref=${stat.stat.ref}, roll=${JSON.stringify(stat.roll)}`);
      }
    }

    console.log("\n=== Unknown Modifiers ===");
    for (const um of item.unknownModifiers) {
      console.log(`  unknown: type=${um.type}, text="${um.text}"`);
    }

    console.log("\n=== statsByType ===");
    for (const calc of item.statsByType) {
      console.log(`  calc: ref=${calc.stat.ref}, type=${calc.type}, sources=${calc.sources.length}`);
    }

    expect(item.info.refName).toBe("The Taming");
    expect(item.isCorrupted).toBe(true);

    const explicitStats = item.statsByType.filter((c) => c.type === "explicit");
    console.log("\nExplicit stats count:", explicitStats.length);
    explicitStats.forEach((s) => console.log("  -", s.stat.ref));

    expect(explicitStats.length).toBe(4);
    expect(item.unknownModifiers.length).toBe(0);
  });

  it("should create filters for all The Taming stats", () => {
    const result = parseClipboard(tamingText);
    expect(result.isOk()).toBe(true);
    const item = result._unsafeUnwrap();

    const filters = initUiModFilters(item, {
      searchStatRange: 50,
      defaultAllSelected: false,
    });

    console.log("\n=== Filters ===");
    for (const f of filters) {
      console.log(`  filter: ref=${f.statRef}, tag=${f.tag}, hidden=${f.hidden}, disabled=${f.disabled}, roll=${f.roll ? JSON.stringify(f.roll) : 'undefined'}`);
    }

    const visibleFilters = filters.filter((f: any) => !f.hidden);
    console.log(`\nTotal filters: ${filters.length}, Visible: ${visibleFilters.length}`);

    const explicitFilters = filters.filter((f: any) => f.tag === "explicit");
    console.log(`Explicit filters: ${explicitFilters.length}`);
    explicitFilters.forEach((f: any) => {
      console.log(`  - ref=${f.statRef} text="${f.text}" hidden=${f.hidden}`);
      if (f.sources && f.sources[0]) {
        console.log(`    translation: "${f.sources[0].stat.translation.string}"`);
      }
    });

    expect(explicitFilters.length).toBe(4);
  });
});
