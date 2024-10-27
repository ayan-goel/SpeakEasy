import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pythonApiUrl = 'http://127.0.0.1:5000/generate-question'; // Ensure this matches your Python endpoint
    const pythonResponse = await fetch(pythonApiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!pythonResponse.ok) {
      const errorText = await pythonResponse.text();
      throw new Error(`Python API error: ${pythonResponse.status} - ${errorText}`);
    }

    const data = await pythonResponse.json();
    return NextResponse.json({ question: data.question });
  } catch (error) {
    console.error("Error fetching question from Python API:", error);
    return NextResponse.json({ error: "Failed to fetch question from Python API" }, { status: 500 });
  }
}