// The climber: what it looks like, and what gear it has earned.
// Appearance is chosen by the user; gear is earned by rank and cannot be picked.

export interface AvatarConfig {
  skin: number; // index into SKINS
  hair: number; // index into HAIRSTYLES
  hairColour: number; // index into HAIR_COLOURS
  accent: number; // index into ACCENTS, used for the tie and trim
}

export const DEFAULT_AVATAR: AvatarConfig = { skin: 2, hair: 1, hairColour: 0, accent: 0 };

export const SKINS = ['#f7d9c0', '#f0c49b', '#d9a273', '#b47a4e', '#8a5a36', '#5c3a22'];
export const HAIRSTYLES = ['None', 'Short', 'Swept', 'Curly', 'Bun', 'Long'];
export const HAIR_COLOURS = ['#2c2320', '#5a3b23', '#a86b2d', '#d9c07a', '#9aa0aa', '#7c4dff'];
export const ACCENTS = ['#e14b4b', '#4ea3ff', '#36d399', '#a78bfa', '#f0b429', '#ff7ab8'];

/** Gear unlocks with rank. Earned, not chosen, so the climber visibly changes as you progress. */
export interface Gear {
  lanyard: boolean;
  tie: boolean;
  coffee: boolean;
  glasses: boolean;
  jacket: boolean;
  briefcase: boolean;
  pocketSquare: boolean;
  crown: boolean;
}

export function gearFor(level: number): Gear {
  return {
    lanyard: level >= 1,
    tie: level >= 2,
    coffee: level >= 3,
    glasses: level >= 4,
    jacket: level >= 5,
    briefcase: level >= 6,
    pocketSquare: level >= 7,
    crown: level >= 8,
  };
}

/** What the next rank adds, for the "coming up" line in the customiser. */
export const GEAR_LABEL: Record<keyof Gear, string> = {
  lanyard: 'Lanyard',
  tie: 'Tie',
  coffee: 'Coffee',
  glasses: 'Glasses',
  jacket: 'Suit jacket',
  briefcase: 'Briefcase',
  pocketSquare: 'Pocket square',
  crown: 'Gold crown',
};

const ORDER: (keyof Gear)[] = [
  'lanyard', 'tie', 'coffee', 'glasses', 'jacket', 'briefcase', 'pocketSquare', 'crown',
];

/** The single item the next level unlocks, or undefined at the top. */
export function nextGear(level: number): string | undefined {
  const item = ORDER[level]; // ORDER[0] is unlocked at level 1, so index level is the next one
  return item ? GEAR_LABEL[item] : undefined;
}
