import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../../components/app/PageStub";

export const Route = createFileRoute("/_app/search")({
  component: () => (
    <PageStub
      eyebrow="חיפוש"
      title="חיפוש בחממה"
      emptyTitle="מה תרצה למצוא?"
      emptyDescription="חיפוש גלובלי (Ctrl K) על קורסים, שיעורים, פוסטים וחברים ייכנס בפאזת הקהילה."
    />
  ),
});
