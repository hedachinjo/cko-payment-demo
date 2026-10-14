
// npm run dev
// Invoke-RestMethod -Uri "http://localhost:3000/api/payment-session" -Method POST

import { NextResponse } from "next/server";

export async function POST() {
  const secretKey = process.env.CKO_SECRET_KEY;
  const baseUrl = process.env.CKO_API_BASE_URL;
  const processingChannelId=process.env.CKO_PROCESSING_CHANNEL_ID;

  if (!secretKey || !baseUrl || !processingChannelId) {
    return NextResponse.json(
      { error: "Missing Checkout.com environment configuration" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/payment-sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 2500,
          currency: "USD",
          processing_channel_id: processingChannelId,
          reference: `DEMO-${crypto.randomUUID()}`,
          billing: {
            address: {
              country: "US",
            },
          },
          customer: {
            name: "Test Customer",
            email: "test@example.com",
          },
          success_url: "http://localhost:3000/payment-success",
          failure_url: "http://localhost:3000/payment-failure",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Checkout.com error:", response.status, data);
      return NextResponse.json(
        { error: "Payment Session creation failed", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment Session request failed:", error);
    return NextResponse.json(
      { error: "Unable to connect to Checkout.com" },
      { status: 500 }
    );
  }
}
