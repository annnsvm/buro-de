import { Link } from 'react-router-dom';
import { Container } from '@/components/layout';
import { ROUTES } from '@/helpers/routes';
import { SELLER } from '@/seo/seller';

const sectionTitleClass =
  'mt-10 text-xl font-semibold text-[var(--color-neutral-darkest)] sm:text-2xl first:mt-0';
const clauseClass = 'mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]';
const listClass =
  'mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--color-text-secondary)]';
const linkClass =
  'text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]';

/**
 * The public offer: the contract a student enters into by paying.
 *
 * Built on the shape live Ukrainian course platforms use - terms, subject, how the contract
 * is entered into, price, access, obligations, refunds, intellectual property, personal
 * data, liability, force majeure, disputes, term, details.
 *
 * Two things here are deliberately tied to what the platform actually does rather than to
 * what is convenient to promise. The refund window ends when the student opens a paid
 * lesson, which the platform records, so the rule is checkable by both sides rather than
 * arguable. And a refund closes the course while keeping the student's progress, because
 * that is exactly what the code does.
 */
const PublicOfferPage = () => {
  const emailLink = (
    <a href={`mailto:${SELLER.email}`} className={linkClass}>
      {SELLER.email}
    </a>
  );

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[var(--color-soapstone-base)] pt-31 text-[var(--color-text-primary)] antialiased">
      <section className="px-4 pb-12 sm:pb-16 lg:pb-20" aria-label="Публічна оферта">
        <Container>
          <article className="mx-auto max-w-3xl rounded-2xl border border-[var(--opacity-neutral-darkest-15)] bg-[var(--color-neutral-white)] px-6 py-10 sm:px-10 sm:py-12">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Редакція від 21.11.2026
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-neutral-darkest)] sm:text-4xl">
              Публічна оферта
            </h1>

            <p className={clauseClass}>
              Цей документ є офіційною та публічною пропозицією (офертою) ФОП{' '}
              {SELLER.name} (далі - «Виконавець») укласти договір про надання послуг з доступу
              до онлайн-курсів на платформі BÜRO.DE на умовах, викладених нижче.
            </p>
            <p className={clauseClass}>
              Оферта адресована невизначеному колу фізичних осіб (далі - «Користувач») і
              набирає чинності з моменту її розміщення на сайті. Оплачуючи курс, Користувач
              повністю і беззастережно приймає умови цього договору.
            </p>

            <h2 className={sectionTitleClass}>1. Терміни</h2>
            <p className={clauseClass}>
              <strong>Платформа</strong> - сайт buro-de.com та пов&apos;язаний з ним особистий
              кабінет Користувача.
            </p>
            <p className={clauseClass}>
              <strong>Курс</strong> - структурований навчальний продукт із відеоуроків,
              практичних завдань, тестів і супровідних матеріалів, склад якого описано на
              сторінці курсу.
            </p>
            <p className={clauseClass}>
              <strong>Безкоштовна частина</strong> - перші модулі курсу, доступні без оплати
              кожному зареєстрованому Користувачу.
            </p>
            <p className={clauseClass}>
              <strong>Платна частина</strong> - решта курсу, доступ до якої відкривається
              після оплати.
            </p>
            <p className={clauseClass}>
              <strong>Акцепт</strong> - повне і беззастережне прийняття Користувачем умов цієї
              оферти.
            </p>

            <h2 className={sectionTitleClass}>2. Предмет договору</h2>
            <p className={clauseClass}>
              2.1. Виконавець надає Користувачу доступ до обраного Курсу, а Користувач оплачує
              цей доступ на умовах оферти.
            </p>
            <p className={clauseClass}>
              2.2. Склад Курсу, його рівень, обсяг і вартість зазначені на сторінці Курсу в
              каталозі Платформи.
            </p>
            <p className={clauseClass}>
              2.3. Послуга є інформаційною. Виконавець не здійснює освітню діяльність, що
              підлягає ліцензуванню, і не видає документів про освіту державного зразка.
            </p>
            <p className={clauseClass}>
              2.4. Виконавець не гарантує досягнення Користувачем конкретного рівня володіння
              мовою чи складання зовнішнього іспиту: результат залежить від самостійної роботи
              Користувача.
            </p>

            <h2 className={sectionTitleClass}>3. Порядок укладення договору</h2>
            <p className={clauseClass}>
              3.1. Договір вважається укладеним з моменту акцепту оферти Користувачем, без
              його підписання у паперовій формі.
            </p>
            <p className={clauseClass}>
              3.2. Акцептом є оплата Користувачем вартості обраного Курсу. Здійснюючи оплату,
              Користувач підтверджує, що ознайомився з цією офертою,{' '}
              <Link to={ROUTES.TERMS} className={linkClass}>
                Умовами використання
              </Link>{' '}
              та{' '}
              <Link to={ROUTES.PRIVACY} className={linkClass}>
                Політикою конфіденційності
              </Link>
              , зрозумів їх і погоджується з ними.
            </p>
            <p className={clauseClass}>
              3.3. Акцепт оферти можливий лише повністю. Прийняття її умов частково або із
              застереженнями не допускається.
            </p>

            <h2 className={sectionTitleClass}>4. Вартість і порядок оплати</h2>
            <p className={clauseClass}>
              4.1. Вартість Курсу вказана на його сторінці на Платформі.
            </p>
            <p className={clauseClass}>
              4.2. Оплата здійснюється одним платежем через платіжний сервіс WayForPay
              банківською карткою. Підписка та автоматичні повторні списання не
              застосовуються.
            </p>
            <p className={clauseClass}>
              4.3. Якщо ціну вказано в євро, конвертацію у гривню здійснює банк Користувача
              та/або платіжний сервіс за їхнім курсом на дату операції. Виконавець отримує
              кошти у гривні та не впливає на курс конвертації й банківські комісії.
            </p>
            <p className={clauseClass}>
              4.4. Обов&apos;язок Користувача з оплати вважається виконаним з моменту
              зарахування коштів на рахунок Виконавця.
            </p>
            <p className={clauseClass}>
              4.5. Виконавець має право змінювати вартість Курсів. Зміна ціни не поширюється
              на Курси, вже оплачені Користувачем.
            </p>

            <h2 className={sectionTitleClass}>5. Порядок надання доступу</h2>
            <p className={clauseClass}>
              5.1. Доступ до платної частини Курсу відкривається автоматично після
              підтвердження платежу. На електронну пошту, вказану в акаунті, надходить лист
              про відкриття доступу.
            </p>
            <p className={clauseClass}>
              5.2. Доступ є безстроковим: Курс залишається в особистому кабінеті Користувача,
              і повертатися до нього можна необмежену кількість разів, доки Платформа працює.
            </p>
            <p className={clauseClass}>
              5.3. Доступ надається особисто Користувачу і прив&apos;язується до його акаунта.
            </p>
            <p className={clauseClass}>
              5.4. Якщо доступ не відкрився протягом 15 хвилин після списання коштів,
              Користувач повідомляє про це на {emailLink}, і Виконавець відкриває доступ
              вручну.
            </p>
            <p className={clauseClass}>
              5.5. Виконавець має право доповнювати й оновлювати матеріали Курсу. Обсяг
              оплаченого Курсу при цьому не зменшується.
            </p>

            <h2 className={sectionTitleClass}>6. Права та обов&apos;язки сторін</h2>
            <p className={clauseClass}>6.1. Користувач зобов&apos;язується:</p>
            <ul className={listClass}>
              <li>вказувати достовірні дані при реєстрації;</li>
              <li>не передавати логін і пароль третім особам;</li>
              <li>
                використовувати матеріали Курсу виключно особисто, для власного навчання;
              </li>
              <li>
                не копіювати, не записувати, не поширювати й не перепродавати матеріали Курсу.
              </li>
            </ul>
            <p className={clauseClass}>6.2. Користувач має право:</p>
            <ul className={listClass}>
              <li>користуватися оплаченим Курсом у повному обсязі;</li>
              <li>звертатися до Виконавця з питань щодо роботи Платформи;</li>
              <li>вимагати повернення коштів на умовах розділу 7.</li>
            </ul>
            <p className={clauseClass}>6.3. Виконавець зобов&apos;язується:</p>
            <ul className={listClass}>
              <li>надати доступ до оплаченого Курсу;</li>
              <li>забезпечувати роботу Платформи й усувати технічні несправності;</li>
              <li>розглядати звернення Користувача у строки, встановлені цією офертою.</li>
            </ul>
            <p className={clauseClass}>
              6.4. Виконавець має право обмежити або припинити доступ Користувача без
              повернення коштів у разі передачі доступу третім особам, копіювання або
              поширення матеріалів Курсу.
            </p>

            <h2 className={sectionTitleClass}>7. Повернення коштів</h2>
            <p className={clauseClass}>
              7.1. Користувач має право відмовитися від Курсу і повернути сплачені кошти в
              повному обсязі протягом <strong>14 календарних днів</strong> з дати оплати за
              умови, що він <strong>не відкривав жодного уроку платної частини</strong>.
            </p>
            <p className={clauseClass}>
              7.2. Факт відкриття уроків платної частини фіксується Платформою автоматично і є
              підставою для визначення того, чи було розпочато надання послуги.
            </p>
            <p className={clauseClass}>
              7.3. Після відкриття уроків платної частини послуга вважається такою, що почала
              надаватися, і право на відмову за пунктом 7.1 не застосовується.
            </p>
            <p className={clauseClass}>
              7.4. Незалежно від пункту 7.3, кошти повертаються, якщо:
            </p>
            <ul className={listClass}>
              <li>доступ до оплаченого Курсу не було надано з вини Виконавця;</li>
              <li>
                Курс суттєво не відповідає опису, розміщеному на його сторінці на момент
                оплати;
              </li>
              <li>стався помилковий або подвійний платіж - повертається надлишкова сума.</li>
            </ul>
            <p className={clauseClass}>
              7.5. Для повернення Користувач надсилає заяву на {emailLink} із зазначенням
              прізвища, імені, електронної пошти акаунта, назви Курсу, дати оплати та причини
              звернення.
            </p>
            <p className={clauseClass}>
              7.6. Заява розглядається протягом <strong>5 робочих днів</strong>. Про рішення
              Виконавець повідомляє листом.
            </p>
            <p className={clauseClass}>
              7.7. Погоджена сума повертається на ту саму картку, з якої здійснювалася оплата.
              Строк зарахування залежить від банку і зазвичай становить до 10 робочих днів.
            </p>
            <p className={clauseClass}>
              7.8. Після повернення коштів доступ до Курсу закривається. Прогрес навчання
              Користувача зберігається: у разі повторної купівлі навчання продовжується з того
              місця, де було зупинено. Безкоштовна частина Курсу залишається доступною.
            </p>
            <p className={clauseClass}>
              7.9. Положення цього розділу не обмежують прав Користувача як споживача,
              встановлених законодавством України.
            </p>

            <h2 className={sectionTitleClass}>8. Права інтелектуальної власності</h2>
            <p className={clauseClass}>
              8.1. Усі матеріали Платформи й Курсів - тексти, відео, аудіо, зображення,
              завдання, структура курсів - є об&apos;єктами права інтелектуальної власності
              Виконавця або використовуються ним на законних підставах.
            </p>
            <p className={clauseClass}>
              8.2. Оплачуючи Курс, Користувач отримує обмежену, невиключну, непередавану
              ліцензію на особисте використання матеріалів у навчальних цілях. Права
              інтелектуальної власності до Користувача не переходять.
            </p>
            <p className={clauseClass}>
              8.3. Забороняється запис, відтворення, публікація, передача третім особам,
              продаж і будь-яке комерційне використання матеріалів Курсу без письмової згоди
              Виконавця.
            </p>
            <p className={clauseClass}>
              8.4. Порушення цього розділу є підставою для припинення доступу без повернення
              коштів, а також для захисту прав Виконавця у передбачений законом спосіб.
            </p>

            <h2 className={sectionTitleClass}>9. Персональні дані</h2>
            <p className={clauseClass}>
              9.1. Акцептуючи оферту, Користувач надає згоду на обробку своїх персональних
              даних в обсязі та на умовах, викладених у{' '}
              <Link to={ROUTES.PRIVACY} className={linkClass}>
                Політиці конфіденційності
              </Link>
              .
            </p>
            <p className={clauseClass}>
              9.2. Дані банківської картки Користувача обробляються платіжним сервісом
              WayForPay. Виконавець їх не отримує і не зберігає.
            </p>

            <h2 className={sectionTitleClass}>10. Відповідальність сторін</h2>
            <p className={clauseClass}>
              10.1. Сторони несуть відповідальність згідно із законодавством України.
            </p>
            <p className={clauseClass}>
              10.2. Виконавець не відповідає за неможливість користування Платформою з причин,
              що перебувають поза його контролем: відсутність інтернету в Користувача,
              несправність його обладнання, дії операторів зв&apos;язку чи платіжних систем.
            </p>
            <p className={clauseClass}>
              10.3. Відповідальність Виконавця за цим договором обмежується сумою, фактично
              сплаченою Користувачем за відповідний Курс.
            </p>

            <h2 className={sectionTitleClass}>11. Форс-мажор</h2>
            <p className={clauseClass}>
              11.1. Сторони звільняються від відповідальності за невиконання зобов&apos;язань,
              якщо воно спричинене обставинами непереборної сили: воєнними діями, збройною
              агресією, стихійним лихом, рішеннями органів влади, масштабними відключеннями
              електропостачання чи зв&apos;язку та іншими подіями поза контролем сторін.
            </p>
            <p className={clauseClass}>
              11.2. Сторона, для якої настали такі обставини, повідомляє іншу сторону у
              розумний строк.
            </p>
            <p className={clauseClass}>
              11.3. Якщо обставини непереборної сили унеможливлюють надання доступу до Курсу
              понад 60 календарних днів поспіль, Користувач має право вимагати повернення
              сплачених коштів пропорційно ненаданій частині послуги.
            </p>

            <h2 className={sectionTitleClass}>12. Вирішення спорів</h2>
            <p className={clauseClass}>
              12.1. Усі спори сторони вирішують шляхом переговорів. Претензія надсилається на{' '}
              {emailLink} і розглядається протягом 15 календарних днів.
            </p>
            <p className={clauseClass}>
              12.2. Якщо згоди не досягнуто, спір вирішується в судовому порядку відповідно до
              законодавства України.
            </p>
            <p className={clauseClass}>
              12.3. До відносин сторін застосовується право України.
            </p>

            <h2 className={sectionTitleClass}>13. Строк дії та зміни оферти</h2>
            <p className={clauseClass}>
              13.1. Оферта діє з моменту розміщення на сайті до її відкликання Виконавцем.
            </p>
            <p className={clauseClass}>
              13.2. Виконавець має право змінювати умови оферти. Нова редакція набирає
              чинності з моменту розміщення на сайті та не поширюється на Курси, оплачені до
              цього моменту.
            </p>
            <p className={clauseClass}>
              13.3. Чинна редакція завжди доступна за цією адресою. Дата редакції вказана на
              початку сторінки.
            </p>

            <h2 className={sectionTitleClass}>14. Реквізити Виконавця</h2>
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

            <p className={clauseClass}>
              Порядок оплати й повернення коштів у стислому вигляді описано на сторінці{' '}
              <Link to={ROUTES.PAYMENT} className={linkClass}>
                Оплата і повернення коштів
              </Link>
              .
            </p>
          </article>
        </Container>
      </section>
    </div>
  );
};

export default PublicOfferPage;
