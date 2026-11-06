import type { CodeLanguage } from "@/lib/code-tokenizer";

export type CodeSample = {
  name: string;
  language: CodeLanguage;
  label: string;
  note: string;
  /** Simple Icons slug for the language's official mark (content/tools.ts). */
  logo: string;
  run: string;
  result: string;
  code: string;
};

/**
 * The four files the home page editor types, from the prototype. The Python
 * agent books a GetwithUs scoping call, like the WhatsApp demo.
 */
export const codeSamples: readonly CodeSample[] = [
  {
    name: "agent.py",
    language: "py",
    label: "Python",
    note: "WhatsApp and calling agents",
    logo: "python",
    run: "$ python agent.py",
    result: "✓ agent online, listening on WhatsApp",
    code: [
      "# WhatsApp scoping-call agent",
      "from getwithus import Agent, tools",
      "",
      "agent = Agent(",
      '    name="GetwithUs assistant",',
      "    tools=[tools.calendar, tools.crm],",
      '    handoff="human_on_request",',
      ")",
      "",
      '@agent.on("message")',
      "async def reply(msg):",
      '    slot = await tools.calendar.next_free("Wed")',
      '    return f"Booked: {slot}"',
    ].join("\n"),
  },
  {
    name: "page.tsx",
    language: "ts",
    label: "TypeScript",
    note: "Next.js websites and web apps",
    logo: "typescript",
    run: "$ pnpm build",
    result: "✓ compiled, deployed to staging",
    code: [
      "// app/page.tsx, Next.js",
      'import { Hero, Services } from "@/components";',
      'import { getServices } from "@/lib/cms";',
      "",
      "export const revalidate = 60;",
      "",
      "export default async function Home() {",
      "  const services = await getServices();",
      "  return (",
      "    <Services items={services} />",
      "  );",
      "}",
    ].join("\n"),
  },
  {
    name: "main.dart",
    language: "dart",
    label: "Dart",
    note: "Flutter apps for iOS and Android",
    logo: "dart",
    run: "$ flutter build appbundle",
    result: "✓ built app-release.aab",
    code: [
      "// lib/main.dart, Flutter",
      "void main() => runApp(const BookingApp());",
      "",
      "class BookingApp extends StatelessWidget {",
      "  const BookingApp({super.key});",
      "",
      "  @override",
      "  Widget build(BuildContext context) {",
      "    return MaterialApp(home: SlotPicker());",
      "  }",
      "}",
    ].join("\n"),
  },
  {
    name: "schema.sql",
    language: "sql",
    label: "SQL",
    note: "Databases you can query yourself",
    logo: "postgresql",
    run: "$ supabase db push",
    result: "✓ migration applied to production",
    code: [
      "-- bookings table, Supabase",
      "create table bookings (",
      "  id uuid primary key default gen_random_uuid(),",
      "  customer text not null,",
      "  phone text not null,",
      "  slot timestamptz not null,",
      "  status text default 'confirmed'",
      ");",
      "",
      "create index on bookings (slot);",
    ].join("\n"),
  },
];
