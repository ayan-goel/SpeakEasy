// app/api/process-transcript/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the incoming data
    const { question, transcript } = await request.json();
    console.log("Received question and transcript:", question, transcript);

    // Verify that question and transcript are non-empty before proceeding
    if (!question || !transcript) {
      console.error("Error: Missing question or transcript data");
      return NextResponse.json({ error: "Missing question or transcript data" }, { status: 400 });
    }

    // Prepare the call to the Flask API
    const pythonApiUrl = 'http://127.0.0.1:5000/process-transcript';
    const pythonResponse = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, transcript })
    });

    if (!pythonResponse.ok) {
      const errorText = await pythonResponse.text();
      console.error("Error from Python API:", pythonResponse.status, errorText);
      throw new Error(`Python API error: ${pythonResponse.status} - ${errorText}`);
    }

    const data = await pythonResponse.json();
    console.log("Data received from Python API:", data);

    // Return the result to the frontend
    return NextResponse.json({ comparisonResult: data.comparisonResult });
  } catch (error) {
    console.error("Error in process-transcript route:", error);
    return NextResponse.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}