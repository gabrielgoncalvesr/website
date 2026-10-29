import type { Dictionary, Locale } from "@/lib/i18n";
import type { DesignId } from "@/lib/designs";
import * as d1b from "./d1b";
import * as d2c from "./d2c";
import * as d4b from "./d4b";
import * as d18b from "./d18b";

type Part = (p: { locale: Locale; d: Dictionary }) => React.ReactNode;

export const chrome: Record<DesignId, { Header: Part; Footer: Part; Home: Part }> = {
  "1b": d1b,
  "2c": d2c,
  "4b": d4b,
  "18b": d18b,
};
