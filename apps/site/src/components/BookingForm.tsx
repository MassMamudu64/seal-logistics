'use client';
import { useState, type FormEvent } from 'react';
import { Input, Button, Modal } from '@seal/ui';
import { BookingSchema, type BookingInput } from '@/lib/validation';
import { COUNTRIES, type CountryCode } from '@/lib/pricing';

const NAMES: Record<CountryCode, string> = {
  US: 'USA',
  NG: 'Nigeria',
  LR: 'Liberia',
  GH: 'Ghana',
  TG: 'Togo',
  ZA: 'South Africa',
  GN: 'Guinea Conakry',
  GM: 'Gambia',
};

type FieldErrors = Partial<Record<keyof BookingInput | 'form', string>>;
type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; trackingId: string; portalUrl: string }
  | { status: 'error'; message: string };

export function BookingForm({
  initialFrom,
  initialTo,
}: {
  initialFrom?: string | undefined;
  initialTo?: string | undefined;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<SubmitState>({ status: 'idle' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      from: fd.get('from'),
      to: fd.get('to'),
      weight: fd.get('weight') ? Number(fd.get('weight')) : undefined,
      description: fd.get('description') || undefined,
      company_website: fd.get('company_website') || '',
      consent: fd.get('consent') === 'on',
    };

    const parsed = BookingSchema.safeParse(raw);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof BookingInput;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    setState({ status: 'submitting' });
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as
        | { ok: true; trackingId: string; portalUrl: string }
        | { ok: false; error: string };
      if (!res.ok || !data.ok) {
        setState({ status: 'error', message: data.ok ? 'Submission failed.' : data.error });
        return;
      }
      setState({ status: 'success', trackingId: data.trackingId, portalUrl: data.portalUrl });
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' });
    }
  }

  const from = (initialFrom?.toUpperCase() as CountryCode) || 'US';
  const to = (initialTo?.toUpperCase() as CountryCode) || 'NG';

  return (
    <>
      <form
        noValidate
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        aria-busy={state.status === 'submitting'}
        className="mt-10 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            required
            {...(errors.name && { error: errors.name })}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            {...(errors.email && { error: errors.email })}
          />
        </div>
        <Input
          label="Phone (with country code)"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          {...(errors.phone && { error: errors.phone })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CountrySelect
            name="from"
            label="From"
            defaultValue={from}
            {...(errors.from && { error: errors.from })}
          />
          <CountrySelect
            name="to"
            label="To"
            defaultValue={to}
            {...(errors.to && { error: errors.to })}
          />
        </div>

        <Input
          label="Estimated weight"
          name="weight"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          hint="In lb (USA/Liberia outbound) or kg (Nigeria outbound). Leave blank if shipping electronics only."
          {...(errors.weight && { error: errors.weight })}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-neutral-800">
            Shipment details (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={2000}
            className="focus-visible:ring-brand-500 rounded-lg border border-neutral-300 px-3 py-2 text-base focus:outline-none focus-visible:ring-2"
            placeholder="What are you shipping? Any electronics? Special handling?"
          />
        </div>

        {/* Honeypot - visually hidden, kept out of tab order */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4 rounded border-neutral-300"
          />
          <span>
            I agree to the{' '}
            <a href="/legal/privacy" className="underline">
              privacy notice
            </a>
            . Seal Logistics may contact me about this quote.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-danger text-sm">
            {errors.consent}
          </p>
        )}

        <Button
          type="submit"
          intent="accent"
          size="lg"
          full
          disabled={state.status === 'submitting'}
        >
          {state.status === 'submitting' ? 'Submitting…' : 'Get my quote'}
        </Button>

        {state.status === 'error' && (
          <p role="alert" className="text-danger text-sm font-medium">
            {state.message}
          </p>
        )}
      </form>

      <Modal
        open={state.status === 'success'}
        onClose={() => setState({ status: 'idle' })}
        title="Quote received — check your inbox"
        description="We have created a tracking record for your shipment. Save the ID below — you will need it to track progress."
        footer={
          state.status === 'success' ? (
            <Button href={state.portalUrl} intent="primary">
              Open portal
            </Button>
          ) : null
        }
      >
        {state.status === 'success' && (
          <div className="rounded-lg bg-neutral-50 p-4 font-mono text-lg font-semibold tracking-wide">
            {state.trackingId}
          </div>
        )}
      </Modal>
    </>
  );
}

function CountrySelect({
  name,
  label,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  defaultValue: CountryCode;
  error?: string;
}) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className="focus-visible:ring-brand-500 h-11 rounded-lg border border-neutral-300 bg-white px-3 text-base focus:outline-none focus-visible:ring-2"
      >
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {NAMES[c]}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-danger text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
