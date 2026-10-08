import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Select gender" }),
  maritalStatus: z.enum(["Single", "Married", "Other"], { message: "Select status" }),
  occupation: z.string().min(2, "Occupation is required"),
  company: z.string().min(2, "Company is required"),
  annualIncome: z.coerce.number().positive("Income must be greater than 0"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^[0-9]{6}$/, "Enter a 6-digit PIN"),
  country: z.string().min(2, "Country is required"),
  employmentType: z.enum(["Permanent", "Contract", "Self Employed"], {
    message: "Select employment type",
  }),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  department: z.string().min(2, "Department is required"),
  managerName: z.string().min(2, "Manager name is required"),
  preferredContact: z.enum(["Email", "Phone", "SMS"], {
    message: "Select contact preference",
  }),
  newsletter: z.boolean(),
  terms: z.boolean().refine((v) => v, "You must accept the terms"),
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "Male",
  maritalStatus: "Single",
  occupation: "",
  company: "",
  annualIncome: 0,
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  employmentType: "Permanent",
  experience: 0,
  department: "",
  managerName: "",
  preferredContact: "Email",
  newsletter: false,
  terms: false,
};

function App() {
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const employmentType = useWatch({ control, name: "employmentType" });

  const errorCount = Object.keys(errors).length;
  const sections = useMemo(
    () => [
      ["Personal", 7],
      ["Professional", 6],
      ["Address", 6],
      ["Preferences", 4],
    ],
    []
  );

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-2xl font-bold">Enterprise Customer Form</h1>
          <p className="mt-1 text-sm text-slate-500">
            React 18 + TypeScript + Tailwind CSS + React Hook Form + Zod
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-xl border bg-white p-4 lg:sticky lg:top-4">
          <h2 className="font-semibold">Form sections</h2>
          <div className="mt-4 space-y-3">
            {sections.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span>{name}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Validation</span>
              <span className={isValid ? "text-green-600" : "text-amber-600"}>
                {isValid ? "Valid" : `${errorCount} error(s)`}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Changed</span>
              <span>{isDirty ? "Yes" : "No"}</span>
            </div>
          </div>
        </aside>

        <section>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <Section title="1. Personal Information">
              <Field label="First name" error={errors.firstName?.message}>
                <input className="input" {...register("firstName")} />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <input className="input" {...register("lastName")} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" className="input" {...register("email")} />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input className="input" {...register("phone")} />
              </Field>
              <Field label="Date of birth" error={errors.dateOfBirth?.message}>
                <input type="date" className="input" {...register("dateOfBirth")} />
              </Field>
              <Field label="Gender" error={errors.gender?.message}>
                <select className="input" {...register("gender")}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Marital status" error={errors.maritalStatus?.message}>
                <select className="input" {...register("maritalStatus")}>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Other</option>
                </select>
              </Field>
            </Section>

            <Section title="2. Professional Information">
              <Field label="Occupation" error={errors.occupation?.message}>
                <input className="input" {...register("occupation")} />
              </Field>
              <Field label="Company" error={errors.company?.message}>
                <input className="input" {...register("company")} />
              </Field>
              <Field label="Annual income" error={errors.annualIncome?.message}>
                <input
                  type="number"
                  className="input"
                  {...register("annualIncome")}
                />
              </Field>
              <Field label="Employment type" error={errors.employmentType?.message}>
                <select className="input" {...register("employmentType")}>
                  <option>Permanent</option>
                  <option>Contract</option>
                  <option>Self Employed</option>
                </select>
              </Field>
              <Field label="Experience (years)" error={errors.experience?.message}>
                <input type="number" className="input" {...register("experience")} />
              </Field>
              <Field label="Department" error={errors.department?.message}>
                <input className="input" {...register("department")} />
              </Field>
              <Field label="Manager name" error={errors.managerName?.message}>
                <input className="input" {...register("managerName")} />
              </Field>

              {employmentType === "Contract" && (
                <div className="md:col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  Contract employees may require additional HR verification.
                </div>
              )}
            </Section>

            <Section title="3. Address">
              <Field label="Address line 1" error={errors.address1?.message}>
                <input className="input" {...register("address1")} />
              </Field>
              <Field label="Address line 2" error={errors.address2?.message}>
                <input className="input" {...register("address2")} />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input className="input" {...register("city")} />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <input className="input" {...register("state")} />
              </Field>
              <Field label="Postal code" error={errors.postalCode?.message}>
                <input className="input" {...register("postalCode")} />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <input className="input" {...register("country")} />
              </Field>
            </Section>

            <Section title="4. Preferences & Consent">
              <Field label="Preferred contact" error={errors.preferredContact?.message}>
                <select className="input" {...register("preferredContact")}>
                  <option>Email</option>
                  <option>Phone</option>
                  <option>SMS</option>
                </select>
              </Field>

              <div className="flex items-center gap-3 pt-7">
                <input type="checkbox" {...register("newsletter")} />
                <label className="text-sm">Subscribe to newsletter</label>
              </div>

              <div className="md:col-span-2 rounded-lg border p-4">
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1" {...register("terms")} />
                  <span>
                    I agree to the terms and conditions.
                    {errors.terms && (
                      <span className="mt-1 block text-red-600">
                        {errors.terms.message}
                      </span>
                    )}
                  </span>
                </label>
              </div>
            </Section>

            <div className="sticky bottom-0 rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    reset(defaultValues);
                    setSubmitted(null);
                  }}
                  className="rounded-lg border px-5 py-2.5 font-medium hover:bg-slate-50"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-slate-900 px-6 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Customer"}
                </button>
              </div>
            </div>
          </form>

          {submitted && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
              <h2 className="font-semibold text-green-800">
                Form submitted successfully
              </h2>
              <p className="mt-1 text-sm text-green-700">
                In a real application, this object would be sent to the backend API.
              </p>
              <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-white">
                {JSON.stringify(submitted, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-5 border-b pb-3 text-lg font-semibold">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default App;