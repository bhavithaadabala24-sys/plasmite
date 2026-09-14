import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/db";
import { ProfileSettingsForm } from "./profile-settings-form";

export default async function SettingsPage() {
  const { supabase, user } = await requireUser();

  const [{ data: profile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, branch, year, semester")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Account & Preferences"
        title="Settings"
        description="Manage your profile and account."
      />
      <ProfileSettingsForm
        profile={{
          full_name: profile?.full_name ?? "",
          branch: profile?.branch ?? null,
          year: profile?.year ?? null,
          semester: profile?.semester ?? null,
        }}
        email={user.email ?? undefined}
      />
    </div>
  );
}