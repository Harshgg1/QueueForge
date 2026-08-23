export async function wakeWorker() {
    const workerUrl = process.env.WORKER_URL;
    const workerSecret = process.env.WORKER_WAKE_SECRET;

    if (!workerUrl || !workerSecret) {
        console.error("Worker wake configuration missing");
        return;
    }

    try {
        await fetch(`${workerUrl}/wake`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${workerSecret}`,
            },
        });

        console.log("Worker wake request sent");
    } catch (error) {
        // Worker wake-up should NEVER make job creation fail.
        console.error("Failed to wake worker:", error);
    }
}