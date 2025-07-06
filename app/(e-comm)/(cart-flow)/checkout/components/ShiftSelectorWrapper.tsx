"use client";
import { useState } from "react";
import { ShiftSelector } from "./ShiftSelector";

export default function ShiftSelectorWrapper() {
    const [selectedShiftId, setSelectedShiftId] = useState("");
    return (
        <ShiftSelector
            selectedShiftId={selectedShiftId}
            onShiftSelect={setSelectedShiftId}
        />
    );
} 