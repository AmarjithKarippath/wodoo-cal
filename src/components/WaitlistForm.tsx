"use client";

import { FormEvent, useState } from "react";
import { SocialProof } from "@/components/SocialProof";

type WaitlistFormProps = {
  initialCount: number;
};

export function WaitlistForm({ initialCount }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(initialCount);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Could not join the waitlist.");
        return;
      }

      setStatus("success");
      setMessage(
        "You’re officially on the list! Thank you for your interest in Wodoo — we really appreciate it. We’ll send you an email as soon as Wodoo is ready for you.",
      );
      setEmail("");
      if (typeof data.count === "number") setCount(data.count);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="waitlist-panel">
      {status === "success" ? (
        <p className="form-success" role="status">
          {message}
        </p>
      ) : (
        <form className="waitlist-form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <div className="email-row">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Submitting…" : "Get early access"}
            </button>
          </div>
          {status === "error" ? (
            <p className="form-error" role="alert">
              {message}
            </p>
          ) : null}
        </form>
      )}
      <SocialProof count={count} />
    </div>
  );
}
