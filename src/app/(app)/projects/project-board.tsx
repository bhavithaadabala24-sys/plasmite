"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, Circle, Flag, Loader2, Plus, Trash2 } from "lucide-react";

import { ProgressBar } from "@/components/app/progress-bar";
import { createClient } from "@/lib/supabase/client";

type Task = { id: string; title: string; status: "todo" | "in_progress" | "done"; due_date: string | null };
type Milestone = { id: string; title: string; completed: boolean; due_date: string | null };

const PROJECT_STATUS: { value: string; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "research", label: "Research" },
  { value: "planning", label: "Planning" },
  { value: "building", label: "Building" },
  { value: "testing", label: "Testing" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export function ProjectBoard({
  projectId,
  initialStatus,
  initialTasks,
  initialMilestones,
}: {
  projectId: string;
  initialStatus: string;
  initialTasks: Task[];
  initialMilestones: Milestone[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [tasks, setTasks] = useState(initialTasks);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [taskInput, setTaskInput] = useState("");
  const [msInput, setMsInput] = useState("");
  const [busy, setBusy] = useState(false);

  const supabase = createClient();

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? (doneCount / tasks.length) * 100 : 0;

  async function syncProgress() {
    const done = (tasks.length ? (doneCount / tasks.length) * 100 : 0).toFixed(0);
    await supabase.from("projects").update({ progress: Number(done) }).eq("id", projectId);
  }

  async function updateStatus(next: string) {
    setStatus(next);
    await supabase.from("projects").update({ status: next }).eq("id", projectId);
    router.refresh();
  }

  async function toggleTask(task: Task) {
    const next: Task["status"] = task.status === "done" ? "todo" : "done";
    const updated = tasks.map((t) => (t.id === task.id ? { ...t, status: next } : t));
    setTasks(updated);
    await supabase.from("project_tasks").update({ status: next }).eq("id", task.id);
    const doneN = updated.filter((t) => t.status === "done").length;
    const pct = updated.length ? Number(((doneN / updated.length) * 100).toFixed(0)) : 0;
    await supabase.from("projects").update({ progress: pct }).eq("id", projectId);
  }

  async function addTask() {
    const title = taskInput.trim();
    if (!title || busy) return;
    setBusy(true);
    const { data } = await supabase
      .from("project_tasks")
      .insert({ project_id: projectId, title, status: "todo", position: tasks.length })
      .select("id, title, status, due_date")
      .single();
    setBusy(false);
    if (data) {
      setTasks([...tasks, data as Task]);
      setTaskInput("");
    }
  }

  async function deleteTask(taskId: string) {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    await supabase.from("project_tasks").delete().eq("id", taskId);
    syncProgress();
  }

  async function toggleMilestone(ms: Milestone) {
    const updated = milestones.map((m) => (m.id === ms.id ? { ...m, completed: !m.completed } : m));
    setMilestones(updated);
    await supabase.from("project_milestones").update({ completed: !ms.completed }).eq("id", ms.id);
  }

  async function addMilestone() {
    const title = msInput.trim();
    if (!title || busy) return;
    setBusy(true);
    const { data } = await supabase
      .from("project_milestones")
      .insert({ project_id: projectId, title, position: milestones.length })
      .select("id, title, completed, due_date")
      .single();
    setBusy(false);
    if (data) {
      setMilestones([...milestones, data as Milestone]);
      setMsInput("");
    }
  }

  async function deleteMilestone(msId: string) {
    setMilestones(milestones.filter((m) => m.id !== msId));
    await supabase.from("project_milestones").delete().eq("id", msId);
  }

  const inputField =
    "h-10 flex-1 rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-md text-on-surface placeholder:text-secondary/60 shadow-sm focus:border-2 focus:border-ring focus:outline-none";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-display text-label-sm uppercase tracking-wider text-secondary">
              Build Progress
            </p>
            <span className="font-display text-headline-md font-medium text-on-surface">
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar value={progress} className="mt-3" />
          <p className="mt-2 font-body text-body-sm text-on-surface-variant">
            {doneCount}/{tasks.length} tasks complete
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="project-status" className="font-display text-label-sm text-secondary">
            Status
          </label>
          <select
            id="project-status"
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            className="h-9 cursor-pointer rounded-lg border border-border bg-surface-container-lowest px-3 font-body text-body-sm text-on-surface shadow-sm focus:border-2 focus:border-ring focus:outline-none"
          >
            {PROJECT_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
          <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
            <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
              Tasks
            </h2>
            <span className="font-display text-code-sm text-secondary">
              {doneCount}/{tasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-2 p-5">
            <ul className="flex flex-col gap-2">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTask(t)}
                    aria-label={t.status === "done" ? "Mark not done" : "Mark done"}
                    className="shrink-0"
                  >
                    {t.status === "done" ? (
                      <CheckCircle2 className="size-5 text-primary" strokeWidth={2.25} />
                    ) : (
                      <Circle className="size-5 text-outline-variant" strokeWidth={2} />
                    )}
                  </button>
                  <span
                    className={`min-w-0 flex-1 truncate font-body text-body-md ${
                      t.status === "done"
                        ? "text-on-surface-variant line-through"
                        : "text-on-surface"
                    }`}
                  >
                    {t.title}
                  </span>
                  {t.due_date ? (
                    <span className="shrink-0 font-display text-code-sm text-secondary">
                      {t.due_date}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => deleteTask(t.id)}
                    aria-label="Delete task"
                    className="shrink-0 text-secondary transition-colors hover:text-error"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
              {tasks.length === 0 ? (
                <p className="py-6 text-center font-body text-body-sm text-on-surface-variant">
                  No tasks yet — add the first build step.
                </p>
              ) : null}
            </ul>
            <div className="flex gap-2">
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
                placeholder="Add a task…"
                className={inputField}
              />
              <button
                type="button"
                onClick={addTask}
                disabled={!taskInput.trim() || busy}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 font-label-md text-on-primary transition-colors hover:bg-tertiary disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Add
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-surface-variant bg-surface-container-lowest shadow-card">
          <div className="flex items-center justify-between border-b border-surface-variant px-5 py-4">
            <h2 className="font-display text-headline-sm font-medium tracking-tight text-on-surface">
              Milestones
            </h2>
            <span className="font-display text-code-sm text-secondary">
              {milestones.filter((m) => m.completed).length}/{milestones.length}
            </span>
          </div>
          <div className="flex flex-col gap-2 p-5">
            <ul className="flex flex-col gap-2">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleMilestone(m)}
                    aria-label={m.completed ? "Mark not complete" : "Mark complete"}
                    className="shrink-0"
                  >
                    {m.completed ? (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-on-primary">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <Flag className="size-4 text-outline-variant" strokeWidth={2} />
                    )}
                  </button>
                  <span
                    className={`min-w-0 flex-1 truncate font-body text-body-md ${
                      m.completed
                        ? "text-on-surface-variant line-through"
                        : "text-on-surface"
                    }`}
                  >
                    {m.title}
                  </span>
                  {m.due_date ? (
                    <span className="shrink-0 font-display text-code-sm text-secondary">
                      {m.due_date}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => deleteMilestone(m.id)}
                    aria-label="Delete milestone"
                    className="shrink-0 text-secondary transition-colors hover:text-error"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
              {milestones.length === 0 ? (
                <p className="py-6 text-center font-body text-body-sm text-on-surface-variant">
                  Milestones mark major checkpoints of your build.
                </p>
              ) : null}
            </ul>
            <div className="flex gap-2">
              <input
                value={msInput}
                onChange={(e) => setMsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addMilestone();
                }}
                placeholder="Add a milestone…"
                className={inputField}
              />
              <button
                type="button"
                onClick={addMilestone}
                disabled={!msInput.trim() || busy}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-secondary-container px-4 font-label-md text-on-secondary-container transition-colors hover:bg-surface-container-high disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Flag className="size-4" />}
                Add
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}