# Локальна база даних і CI

Два запобіжники, які з'явилися разом: власна база на комп'ютері замість робочої на Render,
і автоматична перевірка кожного pull request.

## Навіщо

Раніше локальна розробка підключалася до тієї самої бази, що й сайт. Будь-яка міграція,
сид або e2e-тест змінював дані живих користувачів. Тепер на комп'ютері своя копія:
зіпсувати там нічого не страшно.

CI перевіряє те, чого не бачать ані `tsc`, ані юніт-тести — що застосунок **справді
стартує**. Саме так було пропущено модуль, у якому guard вимагав провайдера, не
підключеного до модуля: код компілювався, тести проходили, сервер не піднімався.

## Локальна база

```bash
npm run db:up        # підняти PostgreSQL у Docker
npm run db:migrate   # застосувати міграції
npm run db:down      # зупинити (дані лишаються)
npm run db:reset     # стерти все і почати з чистої бази
npm run db:studio    # переглянути дані у браузері
```

Створюються дві бази:

| База | Для чого |
|---|---|
| `buero_dev` | щоденна розробка |
| `buero_test` | e2e-тести, які видаляють і перестворюють дані |

Порт **5433**, щоб не конфліктувати з іншим PostgreSQL на 5432.

### `.env`

```
DATABASE_URL="postgresql://buero:buero@localhost:5433/buero_dev?schema=public"
DATABASE_URL_TEST="postgresql://buero:buero@localhost:5433/buero_test?schema=public"
```

**Ніколи не вписуйте сюди URL робочої бази з Render.** Локальні команди
(`prisma migrate`, `prisma db push`, e2e) тоді змінюватимуть дані живих користувачів.

E2E-тести відмовляться запускатися, якщо `DATABASE_URL_TEST` не задано або дорівнює
`DATABASE_URL` — перевірка у `test/setup-e2e-env.ts`.

## Версія PostgreSQL

Локальний контейнер і CI використовують **ту саму мажорну версію, що й Render** —
зараз 18. Це не косметика: `pg_dump` відмовляється читати сервер новішої версії, ніж
він сам, а поведінка бази між мажорними версіями відрізняється.

Перевірити версію на Render:

```bash
docker exec -i buero-postgres psql "<URL Render без ?schema=public>" -tAc "SHOW server_version;"
```

Якщо Render оновить PostgreSQL — змініть тег образу в `docker-compose.yml` і
`.github/workflows/ci.yml`, потім `npm run db:reset`.

## Копіювання даних з Render у локальну базу

Читає з Render, пише лише локально.

```bash
# 1. URL для libpq: прибрати ?schema=public (це параметр Prisma, psql його не розуміє)
PG_URL=$(grep '^# RENDER_DATABASE_URL' buero-backend-api/.env \
  | sed 's/^# RENDER_DATABASE_URL=//; s/"//g' \
  | python3 -c "import sys;from urllib.parse import *;p=urlsplit(sys.stdin.read().strip());print(urlunsplit((p.scheme,p.netloc,p.path,urlencode([(k,v) for k,v in parse_qsl(p.query) if k!='schema']),p.fragment)))")

# 2. Дамп
docker exec -i buero-postgres pg_dump "$PG_URL" --no-owner --no-privileges > /tmp/buero-dump.sql

# 3. Чиста база і відновлення
npm run db:reset && sleep 10
docker exec -i buero-postgres psql -U buero -d buero_dev -v ON_ERROR_STOP=1 < /tmp/buero-dump.sql

# 4. Тестова база після reset порожня
cd buero-backend-api && DATABASE_URL="postgresql://buero:buero@localhost:5433/buero_test?schema=public" npx prisma migrate deploy
```

Дамп містить таблицю `_prisma_migrations`, тому історія міграцій переноситься разом
із даними і `prisma migrate deploy` після цього не має що застосовувати.

## Нова міграція

```bash
cd buero-backend-api
npx prisma migrate dev --name short_description
```

Створює файл міграції і застосовує його **до локальної** бази. Файл комітиться разом
із кодом. На Render міграція застосується сама під час деплою: Start Command містить
`npx prisma migrate deploy`.

## CI

`.github/workflows/ci.yml` запускається на кожен pull request у `main`.

**Backend:** встановлення залежностей → генерація Prisma-клієнта → міграції на чистій
базі → `tsc` → юніт-тести → збірка → **запуск сервера і перевірка `/api/health`**.

**Frontend:** встановлення → тести → збірка.

Повний `tsc` для фронтенду поки не запускається: у `main` близько п'ятдесяти
успадкованих помилок типів, тож перевірка падала б на кожному PR. Увімкнути, коли їх
почистять.

## Що робити, коли CI червоний

Відкрийте PR → вкладка **Checks** → клацніть на крок, позначений хрестиком.

| Крок упав | Що це означає |
|---|---|
| Typecheck | помилка типів у бекенді |
| Unit tests | зламана логіка; у логах видно, який тест і чому |
| Build | код не збирається |
| Start the server | застосунок не піднімається — найчастіше провайдер, не підключений до модуля |

Ті самі команди локально: `npm --prefix buero-backend-api test`,
`npm --prefix buero-frontend test`, `npm run build` у відповідній папці.
