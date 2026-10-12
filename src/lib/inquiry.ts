/** Choices offered on the inquiry form; shared by the form and the server action that emails it. */
export const INQUIRY_OPTIONS = {
  role: ["Bride", "Groom", "Family", "Planner"],
  eventType: ["Wedding", "Pre-wedding", "Engagement", "Destination wedding"],
  coverage: ["Photography", "Films", "Photography & films"],
  heardFrom: ["Instagram", "Wedding planner", "Friends & family", "Google"],
} as const;

/** Form field names, in the order they appear in the email Gautam receives. */
export const INQUIRY_FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone / WhatsApp"],
  ["location", "Lives in"],
  ["role", "Role"],
  ["eventType", "Event"],
  ["dateFrom", "From"],
  ["dateTo", "To"],
  ["venue", "Venue & city"],
  ["coverage", "Coverage"],
  ["heardFrom", "Heard about us"],
  ["instagram", "Instagram"],
  ["message", "Their story"],
] as const;

export const DATES_UNDECIDED = "Still deciding";

/** Dialling codes offered beside the phone field; India first, then where couples most often live. */
export const DIAL_CODES = [
  ["IN", "India", "+91"],
  ["AE", "United Arab Emirates", "+971"],
  ["GB", "United Kingdom", "+44"],
  ["US", "United States", "+1"],
  ["CA", "Canada", "+1"],
  ["AU", "Australia", "+61"],
  ["SG", "Singapore", "+65"],
  ["NZ", "New Zealand", "+64"],
  ["IT", "Italy", "+39"],
  ["FR", "France", "+33"],
  ["DE", "Germany", "+49"],
  ["NL", "Netherlands", "+31"],
  ["CH", "Switzerland", "+41"],
  ["ES", "Spain", "+34"],
  ["PT", "Portugal", "+351"],
  ["IE", "Ireland", "+353"],
  ["BE", "Belgium", "+32"],
  ["AT", "Austria", "+43"],
  ["SE", "Sweden", "+46"],
  ["NO", "Norway", "+47"],
  ["DK", "Denmark", "+45"],
  ["GR", "Greece", "+30"],
  ["TR", "Turkey", "+90"],
  ["QA", "Qatar", "+974"],
  ["SA", "Saudi Arabia", "+966"],
  ["OM", "Oman", "+968"],
  ["KW", "Kuwait", "+965"],
  ["BH", "Bahrain", "+973"],
  ["HK", "Hong Kong", "+852"],
  ["MY", "Malaysia", "+60"],
  ["TH", "Thailand", "+66"],
  ["ID", "Indonesia", "+62"],
  ["JP", "Japan", "+81"],
  ["LK", "Sri Lanka", "+94"],
  ["NP", "Nepal", "+977"],
  ["MV", "Maldives", "+960"],
  ["MU", "Mauritius", "+230"],
  ["ZA", "South Africa", "+27"],
  ["KE", "Kenya", "+254"],
  ["MX", "Mexico", "+52"],
] as const;

export type InquiryErrors = Partial<
  Record<"name" | "email" | "phone" | "consent", string>
>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks the few things a reply depends on; runs in the browser first and again on the server. */
export function validateInquiry(formData: FormData): InquiryErrors {
  const read = (name: string) => String(formData.get(name) ?? "").trim();
  const errors: InquiryErrors = {};
  if (!read("name")) errors.name = "Please add your names.";
  const email = read("email");
  if (!email) errors.email = "Please add your email.";
  else if (!EMAIL.test(email))
    errors.email = "That email doesn't look quite right.";
  const digits = read("phone").replace(/\D/g, "");
  if (digits && (digits.length < 6 || digits.length > 15))
    errors.phone = "That number looks incomplete.";
  if (!formData.get("consent"))
    errors.consent = "Please tick this so we can reply.";
  return errors;
}

export type InquiryState = {
  status: "idle" | "sent" | "error";
  message?: string;
};
