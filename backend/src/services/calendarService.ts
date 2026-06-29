export function generateIcsBlob(event: {
  title: string
  description: string
  start: Date
  end: Date
  location?: string
}): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Validator Pro//Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@validatorpro.app`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(event.start)}`,
    `DTEND:${formatIcsDate(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
  ]
  if (event.location) lines.push(`LOCATION:${escapeIcs(event.location)}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function googleCalendarUrl(event: {
  title: string
  description: string
  start: Date
  end: Date
  location?: string
}): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const params = new URLSearchParams({
    text: event.title,
    details: event.description,
    dates: `${formatGoogleDate(event.start)}/${formatGoogleDate(event.end)}`,
  })
  if (event.location) params.set('location', event.location)
  return `${base}&${params.toString()}`
}

function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}
