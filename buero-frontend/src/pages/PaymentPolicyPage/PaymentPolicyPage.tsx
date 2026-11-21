import { Link } from 'react-router-dom';
import { Container } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import { SELLER } from '@/seo/seller';

const sectionTitleClass =
  'mt-10 text-xl font-semibold text-[var(--color-neutral-darkest)] sm:text-2xl first:mt-0';
const paragraphClass = 'mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]';
const listClass =
  'mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]';
const linkClass =
  'text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]';

/**
 * Payment and refunds, in one page a buyer can find before they pay.
 *
 * Two jobs. The first is the law's: a seller in e-commerce has to give free access to who
 * they are - name, registration, address, contacts - and the site had none of that anywhere.
 * The second is the promise the code already keeps: a refund closes the course and leaves the
 * student's progress alone, and saying so here is what makes that a term rather than a
 * surprise.
 *
 * It also replaces a dead reference: the Terms pointed refunds at a "Публічна оферта" that
 * was never published.
 */
const PaymentPolicyPage = () => {
  const emailLink = (
    <a href={`mailto:${SELLER.email}`} className={linkClass}>
      {SELLER.email}
    </a>
  );

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[var(--color-soapstone-base)] pt-31 text-[var(--color-text-primary)] antialiased">
      <section className="px-4 pb-12 sm:pb-16 lg:pb-20" aria-label="Оплата і повернення коштів">
        <Container>
          <article className="mx-auto max-w-3xl rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-6 py-10 sm:px-10 sm:py-12">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Останнє оновлення: 21.11.2026
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-neutral-darkest)] sm:text-4xl">
              Оплата і повернення коштів
            </h1>

            <p className={paragraphClass}>
              Ця сторінка пояснює, хто продає курси на платформі BÜRO.DE, як відбувається
              оплата і за яких умов можна повернути кошти. Вона доповнює{' '}
              <Link to={ROUTES.TERMS} className={linkClass}>
                Умови використання
              </Link>{' '}
              і{' '}
              <Link to={ROUTES.PRIVACY} className={linkClass}>
                Політику конфіденційності
              </Link>
              .
            </p>

            <h2 className={sectionTitleClass}>1. Відомості про продавця</h2>
            <p className={paragraphClass}>
              Послуги на платформі BÜRO.DE надає фізична особа-підприємець:
            </p>
            <ul className={listClass}>
              <li>
                <strong>ФОП {SELLER.name}</strong>
              </li>
              <li>Номер запису в Єдиному державному реєстрі: {SELLER.registry}</li>
              <li>Адреса: {SELLER.address}</li>
              <li>Електронна пошта: {emailLink}</li>
              <li>
                Телефон:{' '}
                <a href={`tel:${SELLER.phone}`} className={linkClass}>
                  {SELLER.phone}
                </a>
              </li>
            </ul>

            <h2 className={sectionTitleClass}>2. Що саме купує користувач</h2>
            <p className={paragraphClass}>
              Користувач купує доступ до обраного онлайн-курсу: відеоуроків, практичних завдань,
              тестів та супровідних матеріалів у тому обсязі, який описано на сторінці курсу.
            </p>
            <p className={paragraphClass}>
              Доступ є персональним і надається одному користувачу. Доступ безстроковий: курс
              залишається у вашому навчанні, і повертатися до нього можна необмежену кількість
              разів.
            </p>
            <p className={paragraphClass}>
              Перед покупкою кожен курс має безкоштовну частину - кілька перших модулів, які
              можна пройти без оплати, щоб оцінити подачу й рівень.
            </p>

            <h2 className={sectionTitleClass}>3. Оплата</h2>
            <p className={paragraphClass}>
              Оплата здійснюється через платіжний сервіс{' '}
              <a
                href="https://wayforpay.com"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WayForPay
              </a>{' '}
              банківською карткою Visa або Mastercard.
            </p>
            <ul className={listClass}>
              <li>вартість курсу вказана на його сторінці в каталозі;</li>
              <li>оплата проходить одним платежем, без підписки й автоматичних списань;</li>
              <li>
                доступ до курсу відкривається автоматично одразу після підтвердження платежу;
              </li>
              <li>
                на вказану в акаунті електронну пошту надходить лист із підтвердженням покупки.
              </li>
            </ul>
            <p className={paragraphClass}>
              Якщо гроші списано, а доступ не відкрився протягом 15 хвилин - напишіть на{' '}
              {emailLink}, вкажіть назву курсу й дату платежу, і ми відкриємо доступ вручну.
            </p>

            <h2 className={sectionTitleClass}>4. Безпека платежів</h2>
            <p className={paragraphClass}>
              Дані картки вводяться на захищеній сторінці платіжного сервісу WayForPay і
              передаються у зашифрованому вигляді. BÜRO.DE не отримує, не обробляє і не зберігає
              номер картки, термін її дії чи CVV-код.
            </p>

            <h2 className={sectionTitleClass}>5. Повернення коштів</h2>
            <p className={paragraphClass}>
              Кошти повертаються у таких випадках:
            </p>
            <ul className={listClass}>
              <li>
                <strong>Протягом 14 календарних днів після оплати</strong>, якщо користувач не
                розпочав проходження платної частини курсу - тобто не відкривав платні уроки.
              </li>
              <li>
                <strong>Якщо курс не відповідає опису</strong> на сторінці курсу, або доступ до
                оплаченого курсу не було надано.
              </li>
              <li>
                <strong>У разі помилкового або подвійного платежу</strong> - повертається вся
                надлишково сплачена сума.
              </li>
            </ul>
            <p className={paragraphClass}>
              Після того як користувач розпочав проходження платної частини курсу, право на
              відмову за 14-денним строком не застосовується, оскільки послугу вже почали
              надавати. Це не обмежує права вимагати повернення коштів, якщо курс має істотні
              недоліки.
            </p>

            <h2 className={sectionTitleClass}>6. Як оформити повернення</h2>
            <p className={paragraphClass}>
              Надішліть лист на {emailLink} з теми «Повернення коштів» і вкажіть:
            </p>
            <ul className={listClass}>
              <li>прізвище, ім&apos;я та електронну пошту, вказані в акаунті;</li>
              <li>назву курсу й дату оплати;</li>
              <li>причину звернення.</li>
            </ul>
            <p className={paragraphClass}>
              Заява розглядається протягом <strong>5 робочих днів</strong>. Про рішення ми
              повідомляємо листом на вашу електронну пошту.
            </p>
            <p className={paragraphClass}>
              Якщо повернення погоджено, кошти перераховуються на ту саму картку, з якої
              здійснювалася оплата. Зарахування залежить від банку і зазвичай триває до{' '}
              <strong>10 робочих днів</strong>.
            </p>

            <h2 className={sectionTitleClass}>7. Що відбувається після повернення</h2>
            <p className={paragraphClass}>
              Після повернення коштів доступ до курсу закривається, і курс зникає з розділу
              «Моє навчання».
            </p>
            <p className={paragraphClass}>
              Прогрес навчання при цьому зберігається: якщо ви згодом придбаєте курс знову,
              навчання продовжиться з того місця, де ви зупинилися. Безкоштовна частина курсу
              залишається доступною, як і до покупки.
            </p>

            <h2 className={sectionTitleClass}>8. Контакти</h2>
            <p className={paragraphClass}>
              З усіх питань щодо оплати й повернення коштів звертайтеся на {emailLink} або за
              телефоном{' '}
              <a href={`tel:${SELLER.phone}`} className={linkClass}>
                {SELLER.phone}
              </a>
              .
            </p>
          </article>
        </Container>
      </section>
    </div>
  );
};

export default PaymentPolicyPage;
