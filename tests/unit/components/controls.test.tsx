import { describe, expect, it } from "vitest";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import ChipGroup from "@/components/ui/ChipGroup";
import CodeInput from "@/components/ui/CodeInput";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import RadioGroup from "@/components/ui/RadioGroup";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { render } from "./render";

describe("Button", () => {
  it("renders a button with type=button by default", () => {
    const html = render(<Button>Start a project</Button>);
    expect(html).toMatch(/^<button type="button"/);
    expect(html).toContain("Start a project");
  });

  it("renders an anchor for external links and keeps the label", () => {
    const html = render(<Button href="mailto:hello@example.com">Email us</Button>);
    expect(html).toMatch(/^<a href="mailto:hello@example.com"/);
  });

  it("keeps the label in the layout and disables while loading", () => {
    const html = render(<Button loading>Send and verify</Button>);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("disabled");
    expect(html).toContain('class="invisible');
    expect(html).toContain("Send and verify");
  });

  it("never animates position on hover", () => {
    const html = render(<Button variant="secondary">Back</Button>);
    expect(html).not.toMatch(/hover:(translate|scale|rotate)/);
  });
});

describe("Field", () => {
  it("links the label to the control and announces errors", () => {
    const html = render(
      <Field label="Work email" hint="We send the code here." error="Enter a valid email address.">
        {(control) => <Input type="email" {...control} />}
      </Field>,
    );
    const id = html.match(/<label for="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`id="${id}"`);
    expect(html).toContain(`aria-describedby="${id}-hint ${id}-error"`);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Enter a valid email address.");
  });

  it("marks optional fields in the label", () => {
    const html = render(
      <Field label="Company" optional>
        {(control) => <Input {...control} />}
      </Field>,
    );
    expect(html).toContain("(optional)");
  });

  it("uses a fieldset and legend for groups", () => {
    const html = render(
      <Field label="What do you need?" group>
        {(control) => (
          <ChipGroup
            {...control}
            name="services"
            value={[]}
            onChange={() => undefined}
            options={[]}
          />
        )}
      </Field>,
    );
    expect(html).toMatch(/^<fieldset/);
    expect(html).toContain("<legend");
  });
});

describe("text controls", () => {
  it("render Textarea and Select with options", () => {
    expect(render(<Textarea name="message" />)).toContain("<textarea");
    const html = render(
      <Select name="status" placeholder="Any status" options={[{ value: "new", label: "New" }]} />,
    );
    expect(html).toContain('<option value="">Any status</option>');
    expect(html).toContain('<option value="new">New</option>');
  });
});

describe("ChipGroup", () => {
  it("renders native checkboxes, checked state, and nested options", () => {
    const html = render(
      <ChipGroup
        name="services"
        value={["whatsapp-bot"]}
        onChange={() => undefined}
        options={[
          { value: "web-development", label: "Web development" },
          {
            value: "agentic-automation",
            label: "Agentic automation",
            children: [{ value: "whatsapp-bot", label: "WhatsApp bot" }],
          },
        ]}
      />,
    );
    expect(html.match(/type="checkbox"/g)).toHaveLength(3);
    const checkedInputs = html.match(/<input[^>]*checked=""[^>]*>/g) ?? [];
    expect(checkedInputs).toHaveLength(1);
    expect(checkedInputs[0]).toContain('value="whatsapp-bot"');
    expect(html).toContain("Agentic automation:");
  });
});

describe("RadioGroup and Checkbox", () => {
  it("render Radix radios with labels", () => {
    const html = render(
      <RadioGroup
        aria-label="Timeline"
        options={[
          { value: "asap", label: "As soon as possible" },
          { value: "exploring", label: "Exploring" },
        ]}
      />,
    );
    expect(html).toContain('role="radiogroup"');
    expect(html.match(/role="radio"/g)).toHaveLength(2);
    expect(html).toContain("As soon as possible");
  });

  it("render a checkbox with its label", () => {
    const html = render(<Checkbox label="Unread only" />);
    expect(html).toContain('role="checkbox"');
    expect(html).toContain("Unread only");
  });
});

describe("CodeInput", () => {
  it("renders six labelled boxes holding the value", () => {
    const html = render(<CodeInput id="code" value="042" onChange={() => undefined} />);
    expect(html.match(/<input/g)).toHaveLength(6);
    expect(html).toContain('id="code"');
    expect(html).toContain('autoComplete="one-time-code"');
    expect(html).toContain('aria-label="Digit 1 of 6"');
    expect(html).toMatch(
      /aria-label="Digit 1 of 6"[^>]*value="0"|value="0"[^>]*aria-label="Digit 1 of 6"/,
    );
  });

  it("shows the success state", () => {
    const html = render(<CodeInput value="123456" onChange={() => undefined} status="success" />);
    expect(html).toContain("border-ok");
  });
});
