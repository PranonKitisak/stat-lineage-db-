// functions/api/ws-chat.js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Extract roomId and userId from query params
  const roomId = url.searchParams.get("roomId");
  const userId = url.searchParams.get("userId");
  
  if (!roomId || !userId) {
    return new Response("Missing roomId or userId", { status: 400 });
  }

  // Forward to Durable Object via service binding or direct DO binding
  // Note: For Pages, DO bindings are exposed on env
  if (env.CHAT_ROOM) {
    const id = env.CHAT_ROOM.idFromName(roomId);
    const stub = env.CHAT_ROOM.get(id);
    return stub.fetch(request);
  }

  return new Response("DO Binding not found", { status: 500 });
}
