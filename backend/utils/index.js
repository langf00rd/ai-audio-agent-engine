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
