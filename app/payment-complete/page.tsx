"use client";

import { useEffect } from "react";

export default function PaymentCompletePage() {
  useEffect(() => {
    window.location.href = "paybridge://payment-complete";
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", textAlign: "center", padding: "24px" }}>
      <p style={{ fontSize: "18px", color: "#333" }}>Redirecting back to PayBridge...</p>
      <p style={{ fontSize: "14px", color: "#888", marginTop: "8px" }}>
        If the app does not open automatically,{" "}
        <a href="paybridge://payment-complete" style={{ color: "#163300" }}>
          tap here
        </a>
        .
      </p>
    </div>
  );
}
