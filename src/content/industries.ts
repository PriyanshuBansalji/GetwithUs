/**
 * "Industries we build for" on the home page. [OWNER: confirm industries]
 *
 * List only industries the owner confirms; the section stays hidden while the
 * list is empty. The prototype suggested: clinics and healthcare, salons and
 * wellness, real estate, education and coaching, restaurants and cafes, D2C
 * brands, logistics, manufacturing, professional services, travel and
 * hospitality, automotive, finance, gyms and fitness.
 */
export type IndustryIcon =
  | "clinic"
  | "salon"
  | "home"
  | "education"
  | "restaurant"
  | "retail"
  | "logistics"
  | "factory"
  | "briefcase"
  | "travel"
  | "car"
  | "bank"
  | "fitness";

export const industries: readonly { name: string; icon: IndustryIcon }[] = [];
