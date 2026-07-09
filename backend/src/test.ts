import jobQueue from "./lib/queue";

async function main() {
    await jobQueue.add("test-job", {
        message: "Hello Worker",
    });

    console.log("Job Added");
}

main();