export function getConversationDuration(messages) {
  if (!messages || messages.length === 0) return 0;
  const sorted = messages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  const start = new Date(sorted[0].created_at);
  const end = new Date(sorted[sorted.length - 1].created_at);
  const durationMs = end - start;
  return {
    milliseconds: durationMs,
    seconds: Math.floor(durationMs / 1000),
    minutes: Math.floor(durationMs / 60000),
    hours: +(durationMs / 3600000).toFixed(2),
  };
}

export function groupConversationsBySession(data) {
  return Object.values(
    data.reduce((acc, msg) => {
      const sid = msg.session_id;
      if (!acc[sid]) {
        acc[sid] = {
          session_id: sid,
          messages: [],
          start_dt: msg.created_at,
          end_dt: msg.created_at,
        };
      }
      acc[sid].messages.push(msg);
      if (msg.created_at < acc[sid].start_dt) {
        acc[sid].start_dt = msg.created_at;
      }
      if (msg.created_at > acc[sid].end_dt) {
        acc[sid].end_dt = msg.created_at;
      }
      return acc;
    }, {}),
  );
}
