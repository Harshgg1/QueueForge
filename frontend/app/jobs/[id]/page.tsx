"use client";

import { useParams, useRouter } from "next/navigation";
import { useJob, useJobs } from "@/hooks/useJobs";
import { useMe } from "@/hooks/useMe";
import { useEffect } from "react";

export default function JobDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id;

    if (!jobId || Array.isArray(jobId)) {
        return <p>Invalid job id</p>;
    }
    const { isLoading: userLoading, error: userError } = useMe();
    const { data, isLoading, isError } = useJob(jobId);

    useEffect(() => {
  if (userError) {
    router.push("/login");
  }
}, [userError, router]);

if (userLoading) return <p>Loading...</p>;

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if(isError) {
        return <p>Error loading job details</p>;
    }

    return (
        <div>
            <h2>{data.title}</h2>

      <p>Status: {data.status}</p>

      <p>Type: {data.type}</p>

      <p>
        Created At:{" "}
        {new Date(data.createdAt).toLocaleString()}
      </p>

      {data.type === "IMAGE" ? (
        <>
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${data.result.compressedPath}`}
            alt={data.title}
            width={300}
          />

          <br />

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/${data.result.compressedPath}`}
            target="_blank"
          >
            Download Image
          </a>
        </>
      ) : (
        <>
          <p>Pages: {data.result.pages}</p>

          <p>Characters: {data.result.textLength}</p>

          <p>Preview:</p>

          <p>{data.result.preview}</p>
        </>
      )}
    </div>

    );
}