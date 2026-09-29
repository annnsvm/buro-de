# Листи для приймання перевірки письмового завдання (модуль 4)

Еталонний набір для перевірки промпту автоматичного оцінювання. Оцінки нижче погодила авторка
рубрики, тож для кожного листа це очікуваний результат. Якщо модель ставить інший бал, треба
виправляти промпт або рубрику, а не еталон.

## Завдання (з тесту модуля 4)

> Ви захворіли. На 10:00 у вас була нарада, яку тепер треба скасувати або перенести. Напишіть
> листа керівникові — **6–8 речень у тілі листа** (Betreff, звертання та формула прощання не
> рахуються).

## Критерії (6 балів)

| № | Критерій | Бали |
|---|---|---|
| 1 | У тілі листа 6–8 речень; є звертання (*Sehr geehrte/r …*) і формула прощання (*Mit freundlichen Grüßen* тощо) | 1 |
| 2 | Є речення з **weil**, побудоване правильно: у підрядному реченні дієслово стоїть у кінці; якщо підрядне стоїть на початку, головне речення починається з дієслова (*Verb, Verb*) | 1 |
| 3 | Є речення з **dass**, побудоване правильно за тим самим правилом | 1 |
| 4 | Є речення з **wenn**, побудоване правильно за тим самим правилом | 1 |
| 5 | Є речення про нараду (*absagen / verschieben*), і **das** та **dass** не переплутані. Якщо у листі немає одного з цих слів, помилки теж немає, тож бал ставиться | 1 |
| 6 | Текст зрозумілий і ввічливий: є хоча б одна формула ввічливості (*leider, Es tut mir leid, Das tut mir leid, Vielen Dank, bitte*) і немає різких чи зневажливих фраз (*Das ist alles. Mehr kann ich nicht machen. Das ist jetzt so.*) | 1 |

### Правила підрахунку

1. **Речення тіла листа** — усі речення між звертанням і формулою прощання.
   *Vielen Dank für Ihr Verständnis.* усередині тіла листа рахується як речення тіла.
   Betreff, звертання і *Mit freundlichen Grüßen* + ім'я не рахуються.
2. **Закороткий лист** (менше 6 речень у тілі або немає звертання чи прощання) відсіюється кодом
   ще до перевірки моделлю. Лист повертається студентові з проханням дописати, спроба не
   зараховується.
3. **Кілька речень з одним сполучником.** Для критеріїв 2–4 достатньо одного правильно
   побудованого речення з потрібним сполучником.
4. **Помилки, про які рубрика не питає** (відмінки, артиклі, орфографія поза das/dass), балів
   не знімають, якщо текст лишається зрозумілим.
5. **Критерій 5** навмисно поєднує дві речі (нарада + das/dass). Це рішення авторки, його не
   змінюємо.

---

## L1 — еталон

Зразкова відповідь без змін. Якщо лист не отримує 6 з 6, зламаний промпт, і далі перевіряти
немає сенсу.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um
zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass
ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.
Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | 1 | 1 | 1 | **6** |

---

## L2 — після `weil` дієслово не в кінці

Саме цю помилку перевірка має ловити в першу чергу. Змінено одне речення.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich habe Fieber. Die Besprechung um
zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass
ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.
Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | **0** | 1 | 1 | 1 | 1 | **5** |

---

## L3 — після `dass` дієслово не в кінці

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um
zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass
ich bin am Mittwoch wieder gesund. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.
Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | **0** | 1 | 1 | 1 | **5** |

---

## L4 — речення з `wenn` немає взагалі

Обсяг збережено, речення з wenn замінено іншим.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um
zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass
ich am Mittwoch wieder gesund bin. Ich melde mich morgen wieder bei Ihnen.
Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | **0** | 1 | 1 | **5** |

---

## L5 — `das` написано як `dass`

Речення зі справжнім `dass` лишилося правильним, зламано тільки розрізнення das/dass
(критерій 5). Перевіряємо, що модель не знімає за це ще й критерій 3.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um
zehn muss ich leider absagen. Dass tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass
ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.
Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | 1 | **0** | 1 | **5** |

---

## L6 — закороткий лист, немає формули прощання

Три речення замість шести–восьми. Цей лист **має відсіятися кодом** до звернення до моделі
(правило підрахунку 2). Оцінка нижче — це те, що модель має поставити, якщо лист до неї все ж
потрапить.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin krank. Ich komme heute nicht. Die Besprechung muss ich absagen.
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | **0** | 0 | 0 | 0 | 1 | **0** | **1** |

Рішення авторки:

- **Критерій 5 = 1.** Речення про нараду є, а das/dass не переплутані, бо їх у листі немає.
  За відсутність помилки балів не знімаємо.
- **Критерій 6 = 0.** Немає жодної формули ввічливості. Оцінюємо так само, як L7.

---

## L7 — усі конструкції на місці, але тон невічливий

Усі конструкції є і побудовані правильно. Бал знімається тільки за критерій 6.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich komme heute nicht, weil ich krank bin. Die Besprechung sage ich ab. Das ist jetzt so. Ich
hoffe, dass Sie das verstehen. Wenn ich wieder gesund bin, komme ich. Mehr kann ich nicht
machen. Das ist alles.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | 1 | 1 | **0** | **5** |

Рішення авторки: критерій 6 = 0. У листі немає жодної формули ввічливості, зате є зневажливі
фрази *Das ist jetzt so. Mehr kann ich nicht machen. Das ist alles.*

---

## L8 — помилка, якої немає в рубриці

Усі шість критеріїв виконано, але є граматична помилка в іншому місці: `zu der Arzt` замість
`zum Arzt`. Про відмінки рубрика нічого не каже.

Лист перевіряє, чи модель не надто сувора. Якщо вона зніме тут бал, то валитиме студентів за
те, чого не питали.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um
zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zu der Arzt. Ich hoffe,
dass ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort
Bescheid. Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | 1 | 1 | 1 | **6** |

---

## L9 — після `wenn`-речення немає інверсії в головному

У підрядному реченні дієслово стоїть у кінці правильно, але головне речення після нього
починається з підмета, а не з дієслова. Перевіряємо правило *Verb, Verb* з критерію 4.

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

ich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um
zehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass
ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, ich sage Ihnen sofort Bescheid.
Vielen Dank für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | **0** | 1 | 1 | **5** |

Правильно: *Wenn ich länger krank bin, **sage ich** Ihnen sofort Bescheid.*

---

## L10 — правильний лист зі складнішими конструкціями

Цей лист теж перевіряє, чи модель не надто сувора. Усе побудовано правильно, але структури
відрізняються від еталона:

- речення з `weil` стоїть **на початку**, далі правильна інверсія (*…, kann ich …*);
- у підрядному з `dass` є **модальне дієслово з інфінітивом** (*arbeiten kann*);
- у реченні *dass das Projekt* поруч стоять `dass` і `das`, і обидва вжито правильно. Це
  перевіряє, чи модель не сплутає їх сама;
- нараду **переносять** (*verschieben*), а не скасовують;
- речення з `wenn` має інший підмет (*Sie*).

```
Betreff: Krankmeldung

Sehr geehrte Frau Schmidt,

weil ich seit gestern Fieber habe, kann ich heute leider nicht zur Arbeit kommen. Die
Besprechung um zehn Uhr möchte ich deshalb auf Donnerstag verschieben. Das tut mir sehr leid.
Ich weiß, dass das Projekt gerade sehr wichtig ist. Ich hoffe, dass ich am Donnerstag wieder
arbeiten kann. Wenn Sie Fragen haben, können Sie mir gern eine E-Mail schreiben. Vielen Dank
für Ihr Verständnis.

Mit freundlichen Grüßen
Olha Kovalenko
```

| Критерій | 1 | 2 | 3 | 4 | 5 | 6 | Разом |
|---|---|---|---|---|---|---|---|
| Очікувана оцінка | 1 | 1 | 1 | 1 | 1 | 1 | **6** |

У тілі листа 7 речень.

---

## Що робимо з результатами

Прогоняємо всі десять листів. Можливі три випадки:

- **Збіглося скрізь.** Промпт годиться, вмикаємо перевірку.
- **Розбіжність на L2–L5 або L9.** Модель не бачить конкретне правило. Правимо формулювання
  цього критерію в промпті й прогоняємо знову.
- **Розбіжність на L6–L8 або L10.** Модель тлумачить рубрику інакше, ніж авторка (надто суворо
  чи надто м'яко). Спершу перевіряємо, чи в промпт потрапило оновлене формулювання критеріїв
  і правила підрахунку. Якщо потрапило, а розбіжність лишилася, питаємо авторку.

---

## Результат прогону (29.09.2026)

Модель `claude-opus-5`, `effort: medium`.

```
L1   6/6 111111  ✓        L6   відсіяно кодом, модель не викликалася
L2   5/6 101111  ✓        L7   5/6 111110  ✓
L3   5/6 110111  ✓        L8   6/6 111111  ✓
L4   5/6 111011  ✓        L9   5/6 111011  ✓
L5   5/6 111101  ✓        L10  6/6 111111  ✓
```

Усі дев'ять оцінок збіглися з еталоном з першого разу. Витрачено $0.237 на дев'ять перевірок,
тобто **$0.026 за одну перевірку** — це фактична цифра, а не оцінка.

Що це означає для промпту: формулювання критеріїв і правила підрахунку передані моделі
правильно. Зокрема, вона не знімає бал за помилку, якої немає в рубриці (L8), і не плутається
там, де `dass` і `das` стоять поруч (L10).
