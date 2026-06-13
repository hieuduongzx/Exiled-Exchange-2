import { describe, expect, it, beforeEach } from "vitest";
import { setupTests } from "@specs/vitest.setup";
import { init } from "@/assets/data";
import { parseClipboard } from "@/parser";
import { filterItemProp } from "@/web/price-check/filters/pseudo/item-property";
import { FiltersCreationContext } from "@/web/price-check/filters/create-stat-filters";

describe("Spear item parse bug", () => {
  beforeEach(async () => {
    setupTests();
    await init("vi");
  });

  const spearText = `Item Class: Spears
Rarity: Rare
You cannot use this item. Its stats will be ignored
--------
Dusk Edge
Flying Spear
--------
Quality: +20% (augmented)
Physical Damage: 226-407 (augmented)
Lightning Damage: 1-76 (lightning)
Critical Hit Chance: 5.00%
Attacks per Second: 1.81 (augmented)
--------
Requires: Level 78, 50 Str, 127 Dex
--------
Sockets: S 
--------
Item Level: 80
--------
18% increased Physical Damage (rune)
--------
{ Implicit Modifier }
25(25-35)% increased Projectile Speed with this Weapon
--------
Grants Skill: Spear Throw
--------
{ Prefix Modifier "Tyrannical" (Tier: 2) — Damage, Physical, Attack }
167(155-169)% increased Physical Damage
{ Desecrated Prefix Modifier "Arcing" (Tier: 5) — Damage, Elemental, Lightning, Attack }
Adds 1(1-4) to 76(63-82) Lightning Damage
{ Crafted Prefix Modifier "Razor-sharp" (Tier: 3) — Damage, Physical, Attack }
Adds 20(16-24) to 42(28-42) Physical Damage
{ Suffix Modifier "of the Vampire" (Tier: 1) — Life, Physical, Attack }
Leeches 9.04(9-9.9)% of Physical Damage as Life
{ Suffix Modifier "of Legend" (Tier: 1) — Life }
Gain 72(69-84) Life per enemy killed
{ Suffix Modifier "of Mastery" (Tier: 6) — Attack, Speed }
13(11-13)% increased Attack Speed
`;

  it("should parse spear item correctly", () => {
    const result = parseClipboard(spearText);
    expect(result.isOk()).toBe(true);

    const item = result._unsafeUnwrap();
    console.log("category:", item.category);
    console.log("weaponPHYSICAL:", item.weaponPHYSICAL);
    console.log("weaponLIGHTNING:", item.weaponLIGHTNING);
    console.log("weaponELEMENTAL:", item.weaponELEMENTAL);
    console.log("weaponAS:", item.weaponAS);
    console.log("weaponCRIT:", item.weaponCRIT);
    console.log("quality:", item.quality);
    console.log("newMods count:", item.newMods.length);
    console.log("statsByType count:", item.statsByType.length);
    console.log("info.refName:", item.info?.refName);

    expect(item.weaponPHYSICAL).toBe(316.5); // (226+407)/2
    expect(item.weaponLIGHTNING).toBe(38.5); // (1+76)/2
    expect(item.weaponELEMENTAL).toBe(38.5);
    expect(item.weaponAS).toBe(1.81);
    expect(item.weaponCRIT).toBe(5.0);
    expect(item.quality).toBe(20);
    expect(item.info.refName).toBe("Flying Spear");
  });

  it("should compute correct DPS filters for spear", () => {
    const result = parseClipboard(spearText);
    expect(result.isOk()).toBe(true);
    const item = result._unsafeUnwrap();

    const ctx: FiltersCreationContext = {
      item,
      filters: [],
      statsByType: [...item.statsByType],
      searchInRange: 100,
    };

    filterItemProp(ctx);

    for (const f of ctx.filters) {
      console.log("filter:", f.statRef, "roll:", f.roll, "disabled:", f.disabled);
    }

    const totalDps = ctx.filters.find((f: any) => f.statRef === "Total DPS: #");
    const physDps = ctx.filters.find((f: any) => f.statRef === "Physical DPS: #");
    const eleDps = ctx.filters.find((f: any) => f.statRef === "Elemental DPS: #");
    const aps = ctx.filters.find((f: any) => f.statRef === "Attacks per Second: #");

    expect(totalDps).toBeDefined();
    expect(physDps).toBeDefined();
    expect(eleDps).toBeDefined();
    expect(aps).toBeDefined();

    console.log("totalDPS roll:", totalDps!.roll);
    console.log("physDPS roll:", physDps!.roll);
    console.log("eleDPS roll:", eleDps!.roll);
    console.log("aps roll:", aps!.roll);

    // Expected values: weaponPHYSICAL=316.5, weaponAS=1.81 => pDPS ~ 572.865
    // weaponELEMENTAL=38.5, weaponAS=1.81 => eDPS ~ 69.685
    // totalDPS ~ 642.55
    expect(totalDps!.roll!.value).toBeGreaterThan(600);
    expect(physDps!.roll!.value).toBeGreaterThan(500);
    expect(eleDps!.roll!.value).toBeGreaterThan(60);
  });
});
