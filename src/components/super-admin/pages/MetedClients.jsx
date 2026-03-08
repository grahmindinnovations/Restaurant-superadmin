import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }) {

  const map = {
    scheduled:
      "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800",
    converted:
      "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800",
    cancelled:
      "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-800",
  };

  const labelMap = {
    scheduled: "Meeting Scheduled",
    converted: "Converted",
    cancelled: "Cancelled",
  };

  const cls =
    map[status] ||
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:ring-slate-800";

  const label = labelMap[status] || "Scheduled";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function MetedClients() {

  const [meetings, setMeetings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [meetingProgress, setMeetingProgress] = useState("");
  const [feedback, setFeedback] = useState("");

  /* ---------------- FIRESTORE LISTENER ---------------- */

  useEffect(() => {

    const q = query(collection(db, "scheduled_meetings"));

    const unsub = onSnapshot(q, (snap) => {

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMeetings(data);

    });

    return () => unsub();

  }, []);

  /* ---------------- FILTER ---------------- */

  const filtered = useMemo(() => {

    if (statusFilter === "all") return meetings;

    return meetings.filter((m) => m.status === statusFilter);

  }, [meetings, statusFilter]);

  /* ---------------- UPDATE STATUS ---------------- */

  const updateMeetingStatus = async (id, data) => {

    try {

      const ref = doc(db, "users", id);

      await updateDoc(ref, {
        meetingProgress: data.progress,
        status: data.status,
        feedback: data.feedback,
        meetingCompleted: true,
      });

      alert("Meeting status updated");

    } catch (err) {
      console.error(err);
      alert("Failed to update meeting");
    }
  };

  /* ---------------- TABLE ---------------- */

  const desktopTable = (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">

      <div className="min-w-[880px]">

        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">

          <thead className="bg-slate-50 dark:bg-slate-900/60">

            <tr>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Phone</th>
              <th className="px-3 py-2 text-left font-semibold">Business</th>
              <th className="px-3 py-2 text-left font-semibold">Date</th>
              <th className="px-3 py-2 text-left font-semibold">Time</th>
              <th className="px-3 py-2 text-left font-semibold">Mode</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Action</th>
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-3 text-slate-500">
                  No meetings found
                </td>
              </tr>
            ) : (

              filtered.map((m) => (

                <tr key={m.id} className="hover:bg-slate-50">

                  <td className="px-3 py-3">{m.name || "-"}</td>

                  <td className="px-3 py-3">{m.email || "-"}</td>

                  <td className="px-3 py-3">{m.phone || "-"}</td>

                  <td className="px-3 py-3">{m.businessName || "-"}</td>

                  <td className="px-3 py-3">{m.meetingDate || "-"}</td>

                  <td className="px-3 py-3">{m.meetingTime || "-"}</td>

                  <td className="px-3 py-3">{m.meetingMode || "-"}</td>

                  <td className="px-3 py-3">
                    <StatusBadge status={m.status} />
                  </td>

                  <td className="px-3 py-3">

                    {/* Meeting Progress */}

                    <select
                      className="border p-1 rounded"
                      onChange={(e) => setMeetingProgress(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="attended">Meeting Attended</option>
                      <option value="not_attended">Meeting Not Attended</option>
                    </select>

                    {/* Attended */}

                    {meetingProgress === "attended" && (

                      <div className="mt-2 space-y-2">

                        <label className="block">
                          <input
                            type="radio"
                            name="status"
                            value="pending"
                            onChange={(e) =>
                              updateMeetingStatus(m.id, {
                                progress: "attended",
                                status: e.target.value,
                                feedback,
                              })
                            }
                          />{" "}
                          Pending
                        </label>

                        <label className="block">
                          <input
                            type="radio"
                            name="status"
                            value="approved"
                            onChange={(e) =>
                              updateMeetingStatus(m.id, {
                                progress: "attended",
                                status: e.target.value,
                                feedback,
                              })
                            }
                          />{" "}
                          Approved
                        </label>

                        <label className="block">
                          <input
                            type="radio"
                            name="status"
                            value="rejected"
                            onChange={(e) =>
                              updateMeetingStatus(m.id, {
                                progress: "attended",
                                status: e.target.value,
                                feedback,
                              })
                            }
                          />{" "}
                          Rejected
                        </label>

                        <textarea
                          className="border p-2 w-full rounded"
                          placeholder="Enter feedback"
                          onChange={(e) => setFeedback(e.target.value)}
                        />

                      </div>
                    )}

                    {/* Not Attended */}

                    {meetingProgress === "not_attended" && (

                      <select
                        className="border p-1 mt-2 rounded"
                        onChange={(e) =>
                          updateMeetingStatus(m.id, {
                            progress: "not_attended",
                            status: e.target.value,
                            feedback,
                          })
                        }
                      >
                        <option value="reschedule">Reschedule</option>
                        <option value="reject">Reject</option>
                      </select>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );

  /* ---------------- PAGE UI ---------------- */

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold">Meted Clients</h1>

        <div className="flex gap-2">

          {["all", "scheduled", "converted", "cancelled"].map((t) => (

            <button
              key={t}
              onClick={() => setStatusFilter(t)}
              className={`px-3 py-1 rounded ${
                statusFilter === t ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {t}
            </button>

          ))}

        </div>

      </div>

      <div className="rounded-2xl border p-5">{desktopTable}</div>

    </div>
  );
}