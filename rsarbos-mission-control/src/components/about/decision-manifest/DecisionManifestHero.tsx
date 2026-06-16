import { DecisionManifest, type DecisionManifestProps } from "./DecisionManifest";

export type DecisionManifestHeroProps = Omit<DecisionManifestProps, "mode">;

export function DecisionManifestHero(props: DecisionManifestHeroProps) {
  return <DecisionManifest {...props} mode="hero" />;
}
