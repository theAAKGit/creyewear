"use client";

import { Suspense } from "react";
import SuccessContent from "./successContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}