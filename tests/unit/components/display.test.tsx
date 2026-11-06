import { describe, expect, it } from "vitest";
import Accordion from "@/components/ui/Accordion";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import Dialog from "@/components/ui/Dialog";
import DropdownMenu from "@/components/ui/DropdownMenu";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Logo from "@/components/ui/Logo";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import Sheet from "@/components/ui/Sheet";
import Skeleton from "@/components/ui/Skeleton";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import Toast from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";
import { render } from "./render";

describe("layout primitives", () => {
  it("Section carries the vertical rhythm unless flush", () => {
    expect(render(<Section id="web">Body</Section>)).toContain("py-16 md:py-24");
    expect(render(<Section flush>Body</Section>)).not.toContain("py-16");
  });

  it("SectionIntro renders its heading as the section's label, with the lead", () => {
    const html = render(<SectionIntro id="services-title" title="What we do" lead="Five lines" />);
    expect(html).toContain('id="services-title"');
    expect(html).toContain("What we do");
    expect(html).toContain("Five lines");
  });

  it("Container and Prose render their children", () => {
    expect(render(<Container>Inside</Container>)).toContain("max-w-[1200px]");
    expect(
      render(
        <Prose>
          <h2>Heading</h2>
        </Prose>,
      ),
    ).toContain("max-w-[68ch]");
  });
});

describe("Logo", () => {
  it("links home with an accessible name, the mark, and the outlined wordmark", () => {
    const html = render(<Logo />);
    expect(html).toContain('href="/"');
    expect(html).toContain('aria-label="GetwithUs home"');
    // Both are vector drawings hidden from assistive technology; the link carries the name.
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(2);
    expect(html).toContain("fill-brand-tile");
  });

  it("can show the mark alone", () => {
    expect(render(<Logo showWordmark={false} />).match(/<svg/g)).toHaveLength(1);
  });
});

describe("feedback", () => {
  it("Badge always has text", () => {
    expect(render(<Badge tone="ok">Won</Badge>)).toContain("Won");
  });

  it("EmptyState and ErrorState render title, body, and action", () => {
    const empty = render(
      <EmptyState title="No leads yet" action={<button type="button">Share</button>}>
        Share the site.
      </EmptyState>,
    );
    expect(empty).toContain("No leads yet");
    expect(empty).toContain("Share the site.");
    const error = render(<ErrorState title="Could not load leads" reference="abc123" />);
    expect(error).toContain('role="alert"');
    expect(error).toContain("abc123");
  });

  it("Skeleton is hidden from assistive technology", () => {
    expect(render(<Skeleton className="h-4" />)).toContain('aria-hidden="true"');
  });
});

describe("Table", () => {
  const rows = [
    { id: "1", name: "Test Lead One", status: "New" },
    { id: "2", name: "Test Lead Two", status: "Won" },
  ];

  it("renders a caption, header cells, and a stretched link per row", () => {
    const html = render(
      <Table
        caption="Leads"
        rows={rows}
        rowKey={(row) => row.id}
        rowHref={(row) => `/admin/leads/${row.id}`}
        columns={[
          { key: "name", header: "Name", cell: (row) => row.name },
          { key: "status", header: "Status", cell: (row) => row.status },
        ]}
      />,
    );
    expect(html).toContain('<caption class="sr-only">Leads</caption>');
    expect(html.match(/scope="col"/g)).toHaveLength(2);
    expect(html).toContain('href="/admin/leads/2"');
  });
});

describe("disclosure and overlays", () => {
  it("Accordion puts each question in an h3", () => {
    const html = render(
      <Accordion items={[{ id: "q1", question: "Who owns the code?", answer: "You do." }]} />,
    );
    expect(html).toMatch(/<h3[^>]*>.*Who owns the code\?/);
  });

  it("Tabs renders a labelled tab list", () => {
    const html = render(
      <Tabs
        label="Lead sections"
        tabs={[{ value: "details", label: "Details", content: "Fields" }]}
      />,
    );
    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-label="Lead sections"');
  });

  it("closed overlays render only their trigger", () => {
    expect(
      render(<Dialog title="Mark as spam" trigger={<button type="button">Mark as spam</button>} />),
    ).toContain("Mark as spam");
    expect(
      render(
        <Sheet open={false} onOpenChange={() => undefined} title="Menu">
          Links
        </Sheet>,
      ),
    ).toBe("");
    expect(
      render(
        <DropdownMenu
          trigger={<button type="button">Actions</button>}
          items={[{ label: "Sign out", onSelect: () => undefined }]}
        />,
      ),
    ).toContain("Actions");
    expect(
      render(
        <Tooltip content="Full date">
          <button type="button">2 days ago</button>
        </Tooltip>,
      ),
    ).toContain("2 days ago");
  });

  it("Toast defers the toast library until after hydration", () => {
    expect(render(<Toast />)).toBe("");
  });
});
