import { Lightbulb } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { AddIdeaModal, IdeaStatusSelect } from "./idea-card";
import { DeleteIdeaButton } from "./delete-idea-button";

export default async function IdeasPage() {
  const { supabase, user } = await requireUser();

  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, title, content, status, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const total = ideas?.length ?? 0;
  const live =
    ideas?.filter((i) => i.status === "idea" || i.status === "in_progress").length ?? 0;
  const built = ideas?.filter((i) => i.status === "built").length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Ideation Journal"
        title="Ideas"
        description="Engineering ideas worth remembering — scratch projects, hacks, research hunches."
        actions={<AddIdeaModal />}
      />

      <div className="flex flex-wrap gap-4">
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">Total</p>
          <p className="font-display text-headline-md font-medium text-on-surface">{total}</p>
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">Live</p>
          <p className="font-display text-headline-md font-medium text-on-surface">{live}</p>
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-3 shadow-card">
          <p className="font-display text-label-sm uppercase tracking-wider text-secondary">Built</p>
          <p className="font-display text-headline-md font-medium text-primary">{built}</p>
        </div>
      </div>

      {(ideas ?? []).length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No ideas yet"
          description="That spark in the middle of a lecture? Capture it here before it's gone."
          action={<AddIdeaModal />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(ideas ?? []).map((idea) => (
            <article
              key={idea.id}
              className="flex flex-col gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-body text-body-lg font-medium leading-snug text-on-surface">
                  {idea.title}
                </p>
                <IdeaStatusSelect ideaId={idea.id} status={idea.status} />
              </div>
              {idea.content ? (
                <p className="line-clamp-5 whitespace-pre-wrap font-body text-body-sm text-on-surface-variant">
                  {idea.content}
                </p>
              ) : null}
              <div className="flex items-center justify-between border-t border-surface-variant pt-3">
                <span className="font-display text-code-sm text-secondary">
                  {new Date(idea.updated_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <DeleteIdeaButton ideaId={idea.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}