import { DecisionManifest, type DecisionManifestProps } from "./DecisionManifest";

export type DecisionManifestExpandedProps = Omit<DecisionManifestProps, "mode">;

export function DecisionManifestExpanded(props: DecisionManifestExpandedProps) {
  return <DecisionManifest {...props} mode="expanded" />;
}
