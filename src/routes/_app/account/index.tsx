import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../../../components/app/PageStub";

export const Route = createFileRoute("/_app/account/")({
  component: () => (
    <PageStub
      eyebrow="החשבון שלי"
      title="החשבון שלי"
      emptyTitle="פרטי החשבון בהכנה"
      emptyDescription="פרטים אישיים, מנוי וחיוב, התראות והעדפות ייכנסו בפאזת הגיימיפיקציה."
    />
  ),
});
