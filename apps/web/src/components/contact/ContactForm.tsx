'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from '@/i18n/navigation';
import {
  contactSchema,
  prefillFromQuery,
  teamSizes,
  type ContactData,
  type ContactInput,
} from '@/lib/contact/schema';
import type { ContactChoice } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { Turnstile } from './Turnstile';
import styles from './ContactForm.module.css';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: 'errSummary' | 'errRateLimited' | 'errServer' | 'errNetwork' };

const errorKey: Record<string, string> = {
  required: 'errRequired',
  email: 'errEmail',
  phone: 'errPhone',
  services: 'errServices',
  tooLong: 'errTooLong',
  invalid: 'errInvalid',
};

/** An answer in the page's language. */
export type FormChoice = Omit<ContactChoice, 'label'> & { label: string };

/** The form's words and answers in the page's language, from the admin (Contact page → 2. Form). */
export type FormTexts = {
  formTitle: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  officeQuestion: string;
  teamSizeQuestion: string;
  servicesQuestion: string;
  servicesHint: string;
  messageLabel: string;
  submit: string;
  successTitle: string;
  successBody: string;
  officeTypes: FormChoice[];
  services: FormChoice[];
};

const emptyForm: ContactInput = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  officeType: undefined as unknown as ContactInput['officeType'],
  teamSize: undefined,
  services: [],
  message: '',
};

export function ContactForm({ fallbackEmail, texts }: { fallbackEmail: string; texts: FormTexts }) {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const openedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const turnstileToken = useRef<string | undefined>(undefined);
  const onToken = useCallback((token: string | undefined) => {
    turnstileToken.current = token;
  }, []);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyForm,
    mode: 'onTouched',
    shouldFocusError: true,
  });

  // Pre-fill from the home page finder (?workspace=…&team=…).
  useEffect(() => {
    openedAt.current = Date.now();
    const q = new URLSearchParams(window.location.search);
    const prefill = prefillFromQuery(
      { workspace: q.get('workspace') ?? undefined, team: q.get('team') ?? undefined },
      texts,
    );
    if (Object.keys(prefill).length) reset({ ...emptyForm, ...prefill });
  }, [reset, texts]);

  useEffect(() => {
    if (status.kind === 'sent') successRef.current?.focus();
    if (status.kind === 'error') statusRef.current?.focus();
  }, [status]);

  const officeType = useWatch({ control, name: 'officeType' });
  const asksTeamSize = !!texts.officeTypes.find((o) => o.id === officeType)?.askTeamSize;
  const message = (field: keyof ContactInput) => {
    const code = errors[field]?.message;
    return code ? t(errorKey[code] ?? 'errInvalid') : undefined;
  };

  const send = async (data: ContactData) => {
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: {
            ...data,
            teamSize: asksTeamSize ? data.teamSize : undefined,
          },
          meta: {
            locale,
            website: honeypot.current?.value ?? '',
            elapsedMs: Date.now() - openedAt.current,
            turnstileToken: turnstileToken.current,
          },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (res.ok && body.ok) {
        setStatus({ kind: 'sent' });
        return;
      }
      if (body.error === 'validation' && body.fields) {
        const entries = Object.entries(body.fields) as [keyof ContactInput, string][];
        entries.forEach(([field, code]) => setError(field, { message: code }));
        if (entries[0]) setFocus(entries[0][0]);
        setStatus({ kind: 'error', message: 'errSummary' });
        return;
      }
      setStatus({ kind: 'error', message: res.status === 429 ? 'errRateLimited' : 'errServer' });
    } catch {
      setStatus({ kind: 'error', message: 'errNetwork' });
    }
  };

  // handleSubmit is called from the event, not during render (refs and time are read on submit).
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) =>
    handleSubmit(send, () => setStatus({ kind: 'error', message: 'errSummary' }))(event);

  if (status.kind === 'sent') {
    return (
      <div className={styles.success} role="status">
        <span className={styles.check} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
        <h2 ref={successRef} tabIndex={-1} className={`xl ${styles.successTitle}`}>
          {texts.successTitle}
        </h2>
        <p>{texts.successBody}</p>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => {
            reset(emptyForm);
            openedAt.current = Date.now();
            setStatus({ kind: 'idle' });
          }}
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  const field = (
    name: keyof ContactInput,
    label: string,
    opts: {
      type?: string;
      auto?: string;
      required?: boolean;
      span?: boolean;
      inputMode?: 'tel' | 'email';
    } = {},
  ) => {
    const err = message(name);
    const id = `contact-${name}`;
    return (
      <div className={[styles.field, opts.span && styles.span].filter(Boolean).join(' ')}>
        <label htmlFor={id}>
          {label}
          {opts.required ? (
            <span className={styles.req} aria-hidden="true">
              {' '}
              *
            </span>
          ) : (
            <span className={styles.opt}> ({t('optional')})</span>
          )}
        </label>
        <input
          id={id}
          type={opts.type ?? 'text'}
          autoComplete={opts.auto}
          inputMode={opts.inputMode}
          aria-required={opts.required || undefined}
          aria-invalid={!!err || undefined}
          aria-describedby={err ? `${id}-error` : undefined}
          {...register(name)}
        />
        {err && (
          <p id={`${id}-error`} className={styles.error}>
            {err}
          </p>
        )}
      </div>
    );
  };

  const officeErr = message('officeType');
  const servicesErr = message('services');
  const messageErr = message('message');

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      // Before JavaScript loads, a submit must never put personal data into the URL.
      method="post"
      action="/api/contact"
      noValidate
      aria-labelledby="contact-form-title"
    >
      <h2 id="contact-form-title" className={styles.formTitle}>
        {texts.formTitle}
      </h2>
      <p className={styles.legend}>
        <span aria-hidden="true">*</span> {t('required')}
      </p>

      {status.kind === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className={styles.alert}>
          {t(status.message, { email: fallbackEmail })}
        </div>
      )}

      <div className={styles.grid}>
        {field('firstName', texts.firstName, { auto: 'given-name', required: true })}
        {field('lastName', texts.lastName, { auto: 'family-name', required: true })}
        {field('company', texts.company, { auto: 'organization', span: true })}
        {field('email', texts.email, {
          type: 'email',
          auto: 'email',
          required: true,
          inputMode: 'email',
        })}
        {field('phone', texts.phone, { type: 'tel', auto: 'tel', inputMode: 'tel' })}

        <fieldset
          className={`${styles.field} ${styles.span} ${styles.choices}`}
          aria-invalid={!!officeErr || undefined}
          aria-describedby={officeErr ? 'contact-officeType-error' : undefined}
        >
          <legend>
            {texts.officeQuestion}
            <span className={styles.req} aria-hidden="true">
              {' '}
              *
            </span>
          </legend>
          <div className={styles.pills}>
            {texts.officeTypes.map((o) => (
              <label key={o.id} className={styles.pill}>
                <input type="radio" value={o.id} {...register('officeType')} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {officeErr && (
            <p id="contact-officeType-error" className={styles.error}>
              {officeErr}
            </p>
          )}
        </fieldset>

        {asksTeamSize && (
          <fieldset className={`${styles.field} ${styles.span} ${styles.choices}`}>
            <legend>
              {texts.teamSizeQuestion}
              <span className={styles.opt}> ({t('optional')})</span>
            </legend>
            <div className={styles.pills}>
              {teamSizes.map((s) => (
                <label key={s} className={styles.pill}>
                  <input type="radio" value={s} {...register('teamSize')} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset
          className={`${styles.field} ${styles.span} ${styles.choices}`}
          aria-describedby={
            servicesErr ? 'contact-services-error contact-services-hint' : 'contact-services-hint'
          }
        >
          <legend>
            {texts.servicesQuestion}
            <span className={styles.req} aria-hidden="true">
              {' '}
              *
            </span>
          </legend>
          <p id="contact-services-hint" className={styles.hint}>
            {texts.servicesHint}
          </p>
          <div className={styles.checks}>
            {texts.services.map((s) => (
              <label key={s.id} className={styles.check2}>
                <input type="checkbox" value={s.id} {...register('services')} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
          {servicesErr && (
            <p id="contact-services-error" className={styles.error}>
              {servicesErr}
            </p>
          )}
        </fieldset>

        <div className={`${styles.field} ${styles.span}`}>
          <label htmlFor="contact-message">
            {texts.messageLabel}
            <span className={styles.opt}> ({t('optional')})</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            maxLength={2000}
            aria-invalid={!!messageErr || undefined}
            aria-describedby={messageErr ? 'contact-message-error' : undefined}
            {...register('message')}
          />
          {messageErr && (
            <p id="contact-message-error" className={styles.error}>
              {messageErr}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: invisible to people and screen readers, tempting for bots. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          ref={honeypot}
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Turnstile onToken={onToken} />

      <p className={styles.privacy}>
        {t.rich('privacyNote', { link: (chunks) => <Link href="/privacy">{chunks}</Link> })}
      </p>

      <button
        type="submit"
        className={styles.submit}
        disabled={status.kind === 'sending'}
        aria-busy={status.kind === 'sending'}
      >
        {status.kind === 'sending' ? t('sending') : texts.submit}
        <Icon name="arrowUpRight" />
      </button>
    </form>
  );
}
