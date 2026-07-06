import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../../components/app/PageStub";

export const Route = createFileRoute("/_app/notifications")({
  component: () => (
    <PageStub
      eyebrow="התראות"
      title="מרכז ההתראות"
      emptyTitle="הכל מושקה ומטופל. אין התראות חדשות."
    />
  ),
});
