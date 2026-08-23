import { redirect } from "next/navigation";

export default function LegacyPilotRedirect() {
  redirect("/operations-health");
}
