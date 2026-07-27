import { type ReactNode, useRef, useState } from 'react';
import {
  CalendarDate,
  type CalendarHandle,
  CalendarMonth,
  CalendarMulti,
  CalendarRange,
  CalendarSelectMonth,
  CalendarSelectYear,
  type DateRange,
} from 'temporal-calendar-react';
import '../src/styles.css';

const Demo = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <section style={{ marginBlockEnd: '3rem' }}>
      <h2 style={{ font: 'bold 1rem system-ui' }}>{title}</h2>
      {children}
    </section>
  );
};

export const App = () => {
  const [date, setDate] = useState('');
  const [range, setRange] = useState<DateRange>([]);
  const [multi, setMulti] = useState<string[]>([]);
  const [locale, setLocale] = useState('en-GB');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const calendarRef = useRef<CalendarHandle>(null);

  return (
    <main dir={dir} style={{ font: '1rem/1.5 system-ui', padding: '2rem', maxWidth: 900 }}>
      <h1>temporal-calendar-react</h1>

      <p style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <label>
          Locale{' '}
          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            <option value="en-GB">en-GB</option>
            <option value="es-ES">es-ES</option>
            <option value="ja-JP">ja-JP</option>
            <option value="ar-EG">ar-EG</option>
          </select>
        </label>
        <label>
          Direction{' '}
          <select value={dir} onChange={(e) => setDir(e.target.value as 'ltr' | 'rtl')}>
            <option value="ltr">ltr</option>
            <option value="rtl">rtl</option>
          </select>
        </label>
        <button type="button" onClick={() => calendarRef.current?.focus()}>
          Focus day
        </button>
      </p>

      <Demo title={`Single date — value: ${date || '(none)'}`}>
        <CalendarDate ref={calendarRef} locale={locale} value={date} onChange={setDate}>
          <CalendarMonth />
        </CalendarDate>
      </Demo>

      <Demo title={`Range — value: ${range.join(' → ') || '(none)'}`}>
        <CalendarRange locale={locale} months={2} value={range} onChange={setRange}>
          <CalendarMonth />
          <CalendarMonth offset={1} />
        </CalendarRange>
      </Demo>

      <Demo title={`Multi — value: ${multi.join(', ') || '(none)'}`}>
        <CalendarMulti locale={locale} value={multi} onChange={setMulti} showWeekNumbers>
          <CalendarMonth />
        </CalendarMulti>
      </Demo>

      <Demo title="Year + month selects, outside days, weekends disallowed">
        <CalendarDate
          locale={locale}
          showOutsideDays
          isDateDisallowed={(d: Date) => [0, 6].includes(d.getUTCDay())}
          heading={
            <span style={{ display: 'flex', gap: '0.5rem' }}>
              <CalendarSelectMonth />
              <CalendarSelectYear maxYears={30} />
            </span>
          }
        >
          <CalendarMonth />
        </CalendarDate>
      </Demo>
    </main>
  );
};
