export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    
    // Cloudflare 환경 변수에서 Gemini API 키를 가져옵니다.
    // 이름은 GEMINI_API_KEY로 설정해야 합니다.
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "GEMINI_API_KEY not configured in Cloudflare." } }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Gemini API 호출 (Streaming 방식)
    const model = "gemini-1.5-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    // Anthropic 형식을 Gemini 형식으로 변환
    const geminiBody = {
      contents: [{
        parts: [{ text: `${body.system}\n\n사용자 질문: ${body.messages[0].content}` }]
      }],
      generationConfig: {
        maxOutputTokens: body.max_tokens || 2048,
        temperature: 0.7,
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: { message: `Gemini API Error: ${errorText}` } }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 스트리밍 응답을 그대로 전달합니다.
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
