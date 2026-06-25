const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"
const model = "openrouter/free"

export const generateResponse = async (prompt) => {
    const res = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { 
                    role: "system", 
                    content: "You are an expert frontend developer. Return ONLY valid raw JSON with no markdown, no code fences, no explanations. The JSON must have 'message' and 'code' keys. The 'code' value must be a complete HTML document with extensive embedded CSS in a <style> tag and JavaScript in a <script> tag." 
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 8000
        }),
    });

    if (!res.ok) {
        const err = await res.text()
        throw new Error("openRouter err: " + err)
    }

    const data = await res.json()
    return data.choices[0].message.content
}
