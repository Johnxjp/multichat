import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model,
        messages: body.messages,
      }),
    }
  );

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData?.error?.message || JSON.stringify(errorData.error) || errorMessage;
    } catch {
      const text = await response.text();
      if (text) errorMessage = text;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
