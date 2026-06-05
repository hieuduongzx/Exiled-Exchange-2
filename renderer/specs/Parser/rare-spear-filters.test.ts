import { describe, expect, it, beforeEach } from "vitest";
import { setupTests } from "@specs/vitest.setup";
import { init } from "@/assets/data";
import { parseClipboard } from "@/parser";
import { initUiModFilters } from "@/web/price-check/filters/create-stat-filters";

describe("Rare Spear price-check filters", () => {
  beforeEach(async () => {
    setupTests();
    await init("en");
  });

  const rareSpearText = `Item Class: Spears
Rarity: Rare
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

  it("should have correct mods in price-check filters", () => {
    const result = parseClipboard(rareSpearText);
    expect(result.isOk()).toBe(true);
    const item = result._unsafeUnwrap();

    const filters = initUiModFilters(item, { searchStatRange: 10, defaultAllSelected: false });

    console.log("=== All Filters ===");
    for (const f of filters) {
      console.log(`tag=${f.tag}, ref="${f.statRef}", disabled=${f.disabled}, hidden=${f.hidden ?? "null"}`);
    }

    // Check important mods are present
    const addsLightning = filters.find(f => f.statRef === "Adds # to # Lightning Damage");
    const addsPhysical = filters.find(f => f.statRef === "Adds # to # Physical Damage");
    const ias = filters.find(f => f.statRef === "#% increased Attack Speed" && f.tag === "explicit");
    const lifeLeech = filters.find(f => f.statRef.includes("Leech") && f.statRef.includes("Life"));
    const lifePerKill = filters.find(f => f.statRef.includes("Life per enemy killed"));
    const physIncreased = filters.find(f => f.statRef === "#% increased Physical Damage" && f.tag === "explicit");

    console.log("\n=== Mods Check ===");
    console.log("Adds Lightning:", addsLightning ? `FOUND (disabled=${addsLightning.disabled})` : "MISSING");
    console.log("Adds Physical:", addsPhysical ? `FOUND (disabled=${addsPhysical.disabled})` : "MISSING");
    console.log("IAS explicit:", ias ? `FOUND (disabled=${ias.disabled})` : "MISSING");
    console.log("Life Leech:", lifeLeech ? `FOUND (disabled=${lifeLeech.disabled})` : "MISSING");
    console.log("Life per kill:", lifePerKill ? `FOUND (disabled=${lifePerKill.disabled})` : "MISSING");
    console.log("Phys increased:", physIncreased ? `FOUND (disabled=${physIncreased.disabled})` : "MISSING");

    expect(addsLightning).toBeDefined();
    expect(addsPhysical).toBeDefined();
    expect(ias).toBeDefined();
    expect(lifeLeech).toBeDefined();
    expect(lifePerKill).toBeDefined();
    expect(physIncreased).toBeDefined();
  });
});
