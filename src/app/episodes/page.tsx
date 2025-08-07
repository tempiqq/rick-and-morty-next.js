import { Suspense } from "react";
import EpisodesPageContent from "./EpisodesPageContent";

export default function EpisodesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EpisodesPageContent />
    </Suspense>
  );
}
