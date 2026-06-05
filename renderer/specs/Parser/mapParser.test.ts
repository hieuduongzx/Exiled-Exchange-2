import { __testExports } from "@/parser/Parser";
import { beforeEach, describe, expect, it } from "vitest";
import { setupTests } from "@specs/vitest.setup";
import { RareMap, RareMapFakeAllProps, TestItem } from "./items";
import { init } from "@/assets/data";
import { ParsedItem } from "@/parser/ParsedItem";
import { parseClipboard } from "@/parser";
import { createExactStatFilters, initUiModFilters } from "@/web/price-check/filters/create-stat-filters";
import { createPresets } from "@/web/price-check/filters/create-presets";
import { ItemCategory, ItemRarity } from "@/parser";

const SkysliverSpear = new TestItem(`Item Class: Spears
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
`);

const RealWaystone = new TestItem(`Item Class: Waystones
Rarity: Rare
Steel Remnant
Waystone (Tier 15)
--------
Revives Available: 0 (augmented)
Item Rarity: +41% (augmented)
Monster Rarity: +43% (augmented)
Waystone Drop Chance: +95% (augmented)
--------
Item Level: 81
--------
{ Prefix Modifier "Penetrating" (Tier: 1) }
Monster Damage Penetrates 13(12-14)% Elemental Resistances
{ Prefix Modifier "Infernal" (Tier: 1) }
Monsters deal 16(15-19)% of Damage as Extra Fire
{ Prefix Modifier "Painful" (Tier: 1) }
17(15-19)% increased Monster Damage
{ Suffix Modifier "of Enduring" (Tier: 1) }
Monsters are Armoured
{ Suffix Modifier "of the Prism" (Tier: 1) }
+33(30-34)% Monster Elemental Resistances
{ Suffix Modifier "of Overpowering" (Tier: 1) }
Monster have 116(100-119)% increased Elemental Ailment Application
--------
Can be used in a Map Device, allowing you to enter a Map. Waystones can only be used once.
`);

describe("parseMap", () => {
  beforeEach(async () => {
    setupTests();
    await init("en");
  });
  it.each([
    [RareMap.rawText, RareMap.mapTier],
    [RareMapFakeAllProps.rawText, RareMapFakeAllProps.mapTier],
  ])(
    "%#. Each mod section is recognized",
    (rawText: string, mapTier: number | undefined) => {
      const sections = __testExports.itemTextToSections(rawText);
      const parsedItem = {} as ParsedItem;
      const res = __testExports.parseWaystone(sections[1], parsedItem);
      expect(res).toBe("SECTION_PARSED");
      expect(parsedItem.mapTier).toBe(mapTier);
    },
  );
  it.each([
    [RareMap.rawText, RareMap],
    [RareMapFakeAllProps.rawText, RareMapFakeAllProps],
  ])(
    "%#. Each mod section adds correct count to newMods",
    (rawText: string, testItem: TestItem) => {
      const sections = __testExports.itemTextToSections(rawText);
      const parsedItem = {} as ParsedItem;

      const res = __testExports.parseWaystone(sections[1], parsedItem);
      expect(res).toBe("SECTION_PARSED");
      expect(parsedItem.mapPackSize).toBe(testItem.mapPackSize);
      expect(parsedItem.mapItemRarity).toBe(testItem.mapItemRarity);
      expect(parsedItem.mapRevives).toBe(testItem.mapRevives);
      expect(parsedItem.mapDropChance).toBe(testItem.mapDropChance);
      expect(parsedItem.mapMagicMonsters).toBe(testItem.mapMagicMonsters);
      expect(parsedItem.mapRareMonsters).toBe(testItem.mapRareMonsters);
    },
  );
});

describe("Waystone full pipeline", () => {
  beforeEach(async () => {
    setupTests();
    await init("en");
  });

  it("parses waystone modifiers into statsByType", () => {
    const item = parseClipboard(RareMap.rawText);
    expect(item.isOk()).toBe(true);

    const parsedItem = item._unsafeUnwrap();
    expect(parsedItem.category).toBe(ItemCategory.Waystone);
    expect(parsedItem.statsByType.length).toBeGreaterThan(0);

    console.log("statsByType count:", parsedItem.statsByType.length);
    for (const calc of parsedItem.statsByType) {
      console.log(`  [${calc.type}] ${calc.stat.ref} (tradeIds: ${JSON.stringify(calc.stat.trade.ids)})`);
    }
    console.log("unknownModifiers count:", parsedItem.unknownModifiers.length);
    for (const unk of parsedItem.unknownModifiers) {
      console.log(`  [${unk.type}] ${unk.text}`);
    }
    console.log("newMods count:", parsedItem.newMods.length);
    for (const mod of parsedItem.newMods) {
      console.log(`  mod [${mod.info.type}] gen=${mod.info.generation} stats=${mod.stats.length}`);
      for (const s of mod.stats) {
        console.log(`    stat: ${s.stat.ref}`);
      }
    }
  });

  it("creates stat filters for waystone", () => {
    const item = parseClipboard(RareMap.rawText)._unsafeUnwrap();
    expect(item.category).toBe(ItemCategory.Waystone);

    const stats = initUiModFilters(item, { searchStatRange: 10, defaultAllSelected: false });
    const explicitStats = stats.filter(s => s.tag === "explicit" || s.tag === "implicit");
    expect(explicitStats.length).toBeGreaterThan(0);
  });

  it("createPresets includes stats for waystone", () => {
    const item = parseClipboard(RareMap.rawText)._unsafeUnwrap();
    const presets = createPresets(item, {
      league: "Standard",
      currency: undefined,
      listingType: "securable",
      collapseListings: "app",
      activateStockFilter: false,
      searchStatRange: 10,
      useEn: true,
      defaultAllSelected: false,
      autoFillEmptyAugmentSockets: false,
    });
    expect(presets.presets.length).toBeGreaterThan(0);
    const activePreset = presets.presets.find(p => p.id === presets.active);
    expect(activePreset).toBeDefined();
    
    console.log("active preset:", activePreset!.id);
    console.log("stats count:", activePreset!.stats.length);
    for (const stat of activePreset!.stats) {
      console.log(`  [${stat.tag}] ${stat.text} hidden=${stat.hidden} disabled=${stat.disabled}`);
    }
    
    expect(activePreset!.stats.length).toBeGreaterThan(0);
  });

  it("waystone active preset stats are not hidden", () => {
    const item = parseClipboard(RareMap.rawText)._unsafeUnwrap();
    const presets = createPresets(item, {
      league: "Standard",
      currency: undefined,
      listingType: "securable",
      collapseListings: "app",
      activateStockFilter: false,
      searchStatRange: 10,
      useEn: true,
      defaultAllSelected: false,
      autoFillEmptyAugmentSockets: false,
    });
    const activePreset = presets.presets.find(p => p.id === presets.active)!;
    const visibleStats = activePreset.stats.filter(s => !s.hidden);
    expect(visibleStats.length).toBeGreaterThan(0);
  });

  it("parses REAL waystone from clipboard", () => {    const item = parseClipboard(RealWaystone.rawText);
    expect(item.isOk()).toBe(true);

    const parsedItem = item._unsafeUnwrap();
    expect(parsedItem.category).toBe(ItemCategory.Waystone);
    expect(parsedItem.mapTier).toBe(15);
    expect(parsedItem.statsByType.length).toBeGreaterThan(0);

    const presets = createPresets(parsedItem, {
      league: "Standard",
      currency: undefined,
      listingType: "securable",
      collapseListings: "app",
      activateStockFilter: false,
      searchStatRange: 10,
      useEn: true,
      defaultAllSelected: false,
      autoFillEmptyAugmentSockets: false,
    });
    const activePreset = presets.presets.find(p => p.id === presets.active)!;

    console.log("=== WAYSTONE PRESET STATS ===");
    for (const stat of activePreset.stats) {
      console.log(`  [${stat.tag}] ${stat.text} tradeId=${JSON.stringify(stat.tradeId)} hidden=${stat.hidden} disabled=${stat.disabled}`);
    }

    const propStats = activePreset.stats.filter(s => s.tag === "property");
    const explicitStats = activePreset.stats.filter(s => s.tag === "explicit");
    console.log("property stats:", propStats.length);
    console.log("explicit stats:", explicitStats.length);

    expect(propStats.length).toBeGreaterThan(0);
    expect(explicitStats.length).toBeGreaterThan(0);
  });

  it("waystone active preset is pseudo", () => {
    const item = parseClipboard(RareMap.rawText)._unsafeUnwrap();
    const presets = createPresets(item, {
      league: "Standard",
      currency: undefined,
      listingType: "securable",
      collapseListings: "app",
      activateStockFilter: false,
      searchStatRange: 10,
      useEn: true,
      defaultAllSelected: false,
      autoFillEmptyAugmentSockets: false,
    });
    expect(presets.active).toBe("filters.preset_pseudo");
  });

  it("parses Skysliver unique spear", () => {
    const item = parseClipboard(SkysliverSpear.rawText);
    expect(item.isOk()).toBe(true);

    const parsedItem = item._unsafeUnwrap();
    expect(parsedItem.rarity).toBe(ItemRarity.Unique);

    console.log("=== SKYSLIVER ===");
    console.log("category:", parsedItem.category);
    console.log("rarity:", parsedItem.rarity);
    console.log("statsByType count:", parsedItem.statsByType.length);
    for (const calc of parsedItem.statsByType) {
      console.log(`  [${calc.type}] ${calc.stat.ref}`);
    }
    console.log("unknownModifiers count:", parsedItem.unknownModifiers.length);
    for (const unk of parsedItem.unknownModifiers) {
      console.log(`  [${unk.type}] ${unk.text}`);
    }
    console.log("newMods count:", parsedItem.newMods.length);
    for (const mod of parsedItem.newMods) {
      console.log(`  mod [${mod.info.type}] gen=${mod.info.generation} stats=${mod.stats.length}`);
    }

    const presets = createPresets(parsedItem, {
      league: "Standard",
      currency: undefined,
      listingType: "securable",
      collapseListings: "app",
      activateStockFilter: false,
      searchStatRange: 10,
      useEn: true,
      defaultAllSelected: false,
      autoFillEmptyAugmentSockets: false,
    });
    const activePreset = presets.presets.find(p => p.id === presets.active)!;

    console.log("active preset:", activePreset.id);
    console.log("active preset stats count:", activePreset.stats.length);
    for (const stat of activePreset.stats) {
      console.log(`  [${stat.tag}] ${stat.text} hidden=${stat.hidden} disabled=${stat.disabled} roll=${JSON.stringify(stat.roll)}`);
    }

    const visibleStats = activePreset.stats.filter(s => !s.hidden);
    console.log("visible stats:", visibleStats.length);
    for (const stat of visibleStats) {
      console.log(`  VISIBLE: [${stat.tag}] ${stat.text}`);
    }
  });
});
