export type IntlReservationFormValues = {
  name: string;
  email: string;
  phoneCountry: string;
  phoneNational: string;
  country: string;
  datePreference1: string;
  datePreference2: string;
  datePreference3: string;
  adults: string;
  age0to5: string;
  age6to12: string;
  age13to19: string;
  accommodation: string;
  accommodationAddress: string;
  referralSource: string;
  agreePolicy: boolean;
};

export type IntlReservationState = {
  ok: boolean;
  error?: string;
  reference?: string;
  values?: IntlReservationFormValues;
};

export const defaultIntlReservationFormValues: IntlReservationFormValues = {
  name: "",
  email: "",
  phoneCountry: "",
  phoneNational: "",
  country: "",
  datePreference1: "",
  datePreference2: "",
  datePreference3: "",
  adults: "2",
  age0to5: "0",
  age6to12: "0",
  age13to19: "0",
  accommodation: "",
  accommodationAddress: "",
  referralSource: "",
  agreePolicy: false,
};

export function valuesFromIntlFormData(formData: FormData): IntlReservationFormValues {
  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const adults = str("adults");
  const age0to5 = str("age_0_5");
  const age6to12 = str("age_6_12");
  const age13to19 = str("age_13_19");
  return {
    name: str("name"),
    email: str("email"),
    phoneCountry: str("phone_country"),
    phoneNational: str("phone_national"),
    country: str("country"),
    datePreference1: str("date_preference_1"),
    datePreference2: str("date_preference_2"),
    datePreference3: str("date_preference_3"),
    adults: adults || "2",
    age0to5: age0to5 || "0",
    age6to12: age6to12 || "0",
    age13to19: age13to19 || "0",
    accommodation: str("accommodation"),
    accommodationAddress: str("accommodation_address"),
    referralSource: str("referral_source"),
    agreePolicy: formData.get("agreePolicy") === "on",
  };
}
