"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadImage from "@/components/UploadImage";
import UploadPdf from "@/components/UploadPdf";
import { useJobs } from "@/hooks/useJobs";
import { useMe } from "@/hooks/useMe";
import { useLogout } from "@/hooks/useLogout";

export default function DashboardPage() {
  const router = useRouter();
  const logout = useLogout();
  const handleLogout = () => {
  logout.mutate(undefined, {
    onSuccess: () => {
      router.push("/login");
    },
  });
};

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useMe();

  const {
    data,
    isLoading,
    isError,
  } = useJobs();

  useEffect(() => {
    if (userError) {
      router.replace("/login");
    }
  }, [userError, router]);

  if (userLoading) {
    return <p>Checking authentication...</p>;
  }

  if (userError) {
    return null;
  }

  if (isLoading) {
    return <p>Loading jobs...</p>;
  }

  if (isError) {
    return <p>Failed to load jobs.</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome {user.data.name}</p>

      <hr />

      <UploadImage />

      <br />

      <UploadPdf />

      <hr />

      <h2>Your Jobs</h2>

      {data.jobs.length === 0 ? (
        <p>No Jobs Found</p>
      ) : (
        data.jobs.map((job: any) => (
          <div
            key={job.id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{job.title}</h3>

            <p>Status : {job.status}</p>

            <p>Type : {job.type}</p>

            <button
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              View Details
            </button>
          </div>

        ))

      )}
      <button
            onClick={handleLogout}
            disabled={logout.isPending}
            >
            {logout.isPending ? "Logging out..." : "Logout"}
            </button>
    </div>
  );
}