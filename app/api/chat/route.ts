import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: 'Server configuration error: Gemini API key missing.' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const geminiPayload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Error from Gemini API:', geminiResponse.status, errorData);
      return NextResponse.json(
        { error: 'Error from Gemini API', details: errorData },
        { status: geminiResponse.status }
      );
    }

    const reader = geminiResponse.body?.getReader();
    const readableStream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.error('Gemini API response body is not readable for streaming.');
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          try {
            const parsedChunk = JSON.parse(buffer);
            const textPart = parsedChunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textPart) {
              controller.enqueue(new TextEncoder().encode(textPart));
              buffer = '';
            }
          } catch (e) {
            // If the chunk is not a complete JSON, keep buffering
            // This basic example assumes a single JSON response or complete JSON chunks.
            // For true token-by-token streaming, a more advanced JSON parsing approach might be needed.
            // For now, we'll just send incomplete chunks as well, or wait for the full JSON.
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Server-side error in /api/chat route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
