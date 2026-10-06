import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { company } from '../../data/company.js'
import { contactEndpoint } from '../../lib/contactEndpoint.js'

export default function ContactForm({ handoff }) {
  const { t, i18n } = useTranslation()
  const endpoint = contactEndpoint()
  const fieldId = useId()
  const [status, setStatus] = useState(null)
  const [mailHref, setMailHref] = useState('')
  const intent = handoff?.audience === 'investor' || handoff?.audience === 'franchisor'
    ? handoff.audience
    : 'direct'
  const topics = [
    { id: 'brand', label: t('contact.topicBrand') },
    { id: 'investor', label: t('contact.topicInvestor') },
    { id: 'service', label: t('contact.topicService') },
    { id: 'general', label: t('contact.topicGeneral') },
  ]
  const schema = z.object({
    name: z.string().trim().min(2, t('contact.nameError')),
    email: z.string().trim().email(t('contact.emailError')),
    phone: z.string().trim(),
    interest: z.string().min(1, t('contact.topicError')),
    message: z.string().trim().min(8, t('contact.messageError')),
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: intent === 'direct' ? '' : t(intent === 'investor' ? 'contact.investorMessage' : 'contact.franchisorMessage'),
    },
  })

  async function onSubmit(values) {
    setStatus(null)
    setMailHref('')
    const topic = topics.find((item) => item.id === values.interest)?.label ?? values.interest
    if (!endpoint) {
      const body = [
        `${t('contact.fullName')}: ${values.name}`,
        `${t('contact.email')}: ${values.email}`,
        `${t('contact.phone')}: ${values.phone}`,
        '',
        values.message,
      ].join('\n')
      setMailHref(`mailto:${company.email}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(body)}`)
      setStatus('prepared')
      return
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ values, handoff: handoff ?? null }),
      })
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setError('root', { message: t('contact.error') })
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="contact-form-grid">
        <div className="field">
          <label htmlFor={`${fieldId}-name`}>{t('contact.fullName')} *</label>
          <input id={`${fieldId}-name`} autoComplete="name" placeholder={t('contact.namePlaceholder')} {...register('name')} aria-invalid={errors.name ? 'true' : 'false'} />
          {errors.name ? <p className="field-error">{errors.name.message}</p> : null}
        </div>
        <div className="field">
          <label htmlFor={`${fieldId}-email`}>{t('contact.email')} *</label>
          <input id={`${fieldId}-email`} type="email" autoComplete="email" dir="ltr" placeholder={t('contact.emailPlaceholder')} {...register('email')} aria-invalid={errors.email ? 'true' : 'false'} />
          {errors.email ? <p className="field-error">{errors.email.message}</p> : null}
        </div>
        <div className="field">
          <label htmlFor={`${fieldId}-phone`}>{t('contact.phone')}</label>
          <input id={`${fieldId}-phone`} type="tel" autoComplete="tel" dir="ltr" placeholder={t('contact.phonePlaceholder')} {...register('phone')} />
        </div>
        <div className="field">
          <label htmlFor={`${fieldId}-interest`}>{t('contact.help')} *</label>
          <select id={`${fieldId}-interest`} {...register('interest')} aria-invalid={errors.interest ? 'true' : 'false'}>
            <option value="">{t('contact.topicEmpty')}</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.label}</option>
            ))}
          </select>
          {errors.interest ? <p className="field-error">{errors.interest.message}</p> : null}
        </div>
        <div className="field full">
          <label htmlFor={`${fieldId}-message`}>{t('contact.more')} *</label>
          <textarea id={`${fieldId}-message`} rows={5} placeholder={t('contact.messagePlaceholder')} {...register('message')} aria-invalid={errors.message ? 'true' : 'false'} />
          {errors.message ? <p className="field-error">{errors.message.message}</p> : null}
        </div>
      </div>
      <p className="form-note">{t('contact.formNote')}</p>
      <button className="button" type="submit" disabled={isSubmitting}>
        {endpoint ? t('contact.send') : t('contact.prepare')}
        <span aria-hidden="true">{i18n.language === 'en' ? '→' : '←'}</span>
      </button>
      {status === 'prepared' ? (
        <div role="status">
          <p className="form-notice">{t('contact.prepared')}</p>
          <a className="text-link" href={mailHref}>{t('contact.openMail')} ↗</a>
        </div>
      ) : null}
      {status === 'sent' ? <p className="form-status" role="status">{t('contact.sent')}</p> : null}
      {status === 'error' ? <p className="form-status" role="alert">{t('contact.error')}</p> : null}
    </form>
  )
}
