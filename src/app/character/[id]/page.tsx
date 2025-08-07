import { Suspense } from "react";
import CharactersInfoPageContent from "./CharactersInfoPageContent";

export default function CharactersInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharactersInfoPageContent />
    </Suspense>
  );
}
