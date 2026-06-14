// FastAPI backend se baat karne wala layer
// session_id yahin manage hota hai (frontend memory)

let sessionId = null;

// Main chat function — message bhejta hai, jawab laata hai
export async function sendMessage(message, mode = "auto") {
  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message,
      mode: mode,
      session_id: sessionId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();

  // backend se mila session_id save karo (agle message ke liye)
  sessionId = data.session_id;

  return {
    answer: data.answer,
    chartData: data.chart_data,
  };
}

// New Chat button ke liye — history clear karo
export async function newChat() {
  if (sessionId) {
    await fetch("/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
  }
  sessionId = null; // reset
}
