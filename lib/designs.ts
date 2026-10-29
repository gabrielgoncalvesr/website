/** Design lab: directions served side by side, picked with the `design` cookie. */
export const designs = [
  { id: "1b", name: "Grid v2", hint: "Static name, one writing wall, contact tiles" },
  { id: "2c", name: "Console v3", hint: "Wide session with neofetch + history panes" },
  { id: "4b", name: "Playground v2", hint: "Wide bento board" },
  { id: "18b", name: "RPG v2", hint: "Full game screen: map, party, HUD" },
] as const;

export type DesignId = (typeof designs)[number]["id"];

export function isDesign(v: string | undefined): v is DesignId {
  return designs.some((d) => d.id === v);
}
