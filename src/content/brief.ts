/**
 * Choices in the project brief. Budget labels are in INR (the primary currency).
 * The stored values stay stable when the labels change.
 */
export const budgetOptions = [
  { value: "range-1", label: "Under ₹50,000" },
  { value: "range-2", label: "₹50,000 to ₹2,00,000" },
  { value: "range-3", label: "₹2,00,000 to ₹10,00,000" },
  { value: "range-4", label: "Above ₹10,00,000" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "1 to 3 months" },
  { value: "3-6-months", label: "3 to 6 months" },
  { value: "exploring", label: "Exploring" },
] as const;

/** Display label for a stored option value; unknown values (from the API) pass through. */
export function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((option) => option.value === value)?.label ?? value;
}
