import BriefProgress from "@/components/forms/BriefProgress";
import { serviceOptions } from "@/components/forms/service-options";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { formCopy } from "@/content/forms";

const pill =
  "inline-flex h-9 items-center rounded-control border border-line-2 bg-card px-3.5 type-small text-muted";

/** The service chips as static pills, laid out exactly like ChipGroup. */
function ChipsPreview() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {serviceOptions.map((option) => (
          <span key={option.value} className={pill}>
            {option.label}
          </span>
        ))}
      </div>
      {serviceOptions
        .filter((option) => option.children?.length)
        .map((option) => (
          <div
            key={option.value}
            className="flex flex-wrap items-center gap-2 border-l-2 border-line pl-4"
          >
            <span className="mr-1 type-small text-body">{option.label}:</span>
            {option.children?.map((child) => (
              <span key={child.value} className={pill}>
                {child.label}
              </span>
            ))}
          </div>
        ))}
    </div>
  );
}

/**
 * The server-rendered stand-in for a form while its code loads: the same
 * fields, labels, and spacing, disabled, so swapping in the real form causes no
 * layout shift. Shown for a moment after first paint, or for good without JavaScript.
 */
export default function FormPreview({ form }: { form: "contact" | "brief" }) {
  if (form === "brief") {
    return (
      <div className="grid gap-10 rounded-panel border border-line bg-card p-6 md:p-10">
        <BriefProgress step={1} done={false} />
        <div className="grid gap-6">
          <h2 className="type-h3">{formCopy.brief.steps[0]}</h2>
          <Field label={formCopy.fields.services} group>
            {() => <ChipsPreview />}
          </Field>
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <Button disabled>{formCopy.continue}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Field label={formCopy.fields.name}>{(control) => <Input {...control} disabled />}</Field>
      <Field label={formCopy.fields.email} hint={formCopy.hints.email}>
        {(control) => <Input {...control} type="email" disabled />}
      </Field>
      <Field label={formCopy.fields.company} optional>
        {(control) => <Input {...control} disabled />}
      </Field>
      <Field label={formCopy.fields.services} optional group>
        {() => <ChipsPreview />}
      </Field>
      <Field label={formCopy.fields.message}>
        {(control) => <Textarea {...control} rows={6} disabled />}
      </Field>
      <div>
        <Button disabled>{formCopy.sendAndVerify}</Button>
      </div>
    </div>
  );
}
