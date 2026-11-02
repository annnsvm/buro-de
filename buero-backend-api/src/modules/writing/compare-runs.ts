/* eslint-disable no-console */
/**
 * Two runs of the same set, side by side.
 *
 * The question a model change has to answer is not "does it still work" but "does it mark the
 * same texts the same way". A diff of console output cannot tell a changed mark from a reordered
 * line, so each run writes its marks to a file and this reads both.
 *
 * Where the set carries the author's own marks, the only comparison that decides anything is
 * against those: a model that disagrees with her less often is better, however it compares with
 * the other model.
 *
 *   npx ts-node -P tsconfig.json src/modules/writing/compare-runs.ts a.json b.json
 */
import { readFileSync } from 'fs';
import type { MarkRow, RunReport } from './run-report';

const load = (path: string): RunReport =>
  JSON.parse(readFileSync(path, 'utf8')) as RunReport;

/** How many criteria this row marks differently from the author's own marks. */
const againstAuthor = (row: MarkRow): number | null => {
  if (!row.expected || row.points.length === 0) return null;
  return row.expected.reduce(
    (wrong, want, index) => wrong + (want === row.points[index] ? 0 : 1),
    0,
  );
};

const main = () => {
  const [pathA, pathB] = process.argv.slice(2);
  if (!pathA || !pathB) {
    console.error('Вкажіть два файли звітів');
    process.exitCode = 1;
    return;
  }

  const a = load(pathA);
  const b = load(pathB);
  if (a.set !== b.set) {
    console.error(`Різні набори: ${a.set} і ${b.set}`);
    process.exitCode = 1;
    return;
  }

  const byId = new Map(b.rows.map((row) => [row.id, row]));
  const lines: string[] = [];
  let same = 0;
  let differ = 0;
  let wrongA = 0;
  let wrongB = 0;
  let compared = 0;

  console.log(`\nНабір: ${a.set}`);
  console.log(`A: ${a.model}\nB: ${b.model}\n`);
  console.log(`${'завдання'.padEnd(12)}${'A'.padEnd(12)}${'B'.padEnd(12)}розбіжність`);
  console.log('-'.repeat(64));

  for (const rowA of a.rows) {
    const rowB = byId.get(rowA.id);
    if (!rowB) {
      console.log(`${rowA.id.padEnd(12)}${"-".padEnd(12)}${"немає".padEnd(12)}пропущено в B`);
      continue;
    }

    const show = (row: MarkRow) =>
      row.refusedBy
        ? `відсіяно`
        : `${row.score}/${row.maxScore} ${row.points.join('')}`;

    const differing = rowA.points
      .map((point, index) => (point === rowB.points[index] ? null : index + 1))
      .filter((n): n is number => n !== null);

    if (rowA.refusedBy || rowB.refusedBy) {
      const note =
        rowA.refusedBy === rowB.refusedBy
          ? 'однаково відсіяно кодом'
          : `відсіяно по-різному: A ${rowA.refusedBy ?? 'ні'}, B ${rowB.refusedBy ?? 'ні'}`;
      console.log(`${rowA.id.padEnd(12)}${show(rowA).padEnd(12)}${show(rowB).padEnd(12)}${note}`);
      continue;
    }

    compared += 1;
    const missA = againstAuthor(rowA);
    const missB = againstAuthor(rowB);
    if (missA !== null) wrongA += missA;
    if (missB !== null) wrongB += missB;

    if (differing.length === 0) {
      same += 1;
      console.log(`${rowA.id.padEnd(12)}${show(rowA).padEnd(12)}${show(rowB).padEnd(12)}-`);
      continue;
    }

    differ += 1;
    console.log(
      `${rowA.id.padEnd(12)}${show(rowA).padEnd(12)}${show(rowB).padEnd(12)}` +
        `критерії ${differing.join(', ')}`,
    );
    for (const n of differing) {
      lines.push(
        `${rowA.id}, критерій ${n}\n` +
          `   A (${a.model}): ${rowA.points[n - 1] === 1 ? 'зараховано' : `не зараховано - ${rowA.comments[n] ?? '-'}`}\n` +
          `   B (${b.model}): ${rowB.points[n - 1] === 1 ? 'зараховано' : `не зараховано - ${rowB.comments[n] ?? '-'}`}`,
      );
    }
  }

  if (lines.length > 0) {
    console.log(`\n${'-'.repeat(64)}\nДе моделі розійшлися\n`);
    for (const line of lines) console.log(`${line}\n`);
  }

  console.log('-'.repeat(64));
  console.log(`однакові оцінки: ${same}/${compared}, різні: ${differ}`);
  if (compared > 0 && (wrongA > 0 || wrongB > 0)) {
    console.log(
      `розбіжностей з еталоном автора: A ${wrongA}, B ${wrongB} ` +
        `(з ${compared * (a.rows[0]?.maxScore ?? 0)} оцінок)`,
    );
  } else if (compared > 0) {
    console.log('з еталоном автора збіглися обидві моделі повністю');
  }
  console.log(
    `ціна набору: A $${a.cost.toFixed(3)}, B $${b.cost.toFixed(3)} ` +
      `(за перевірку $${(a.cost / Math.max(1, a.totals.calls)).toFixed(4)} і ` +
      `$${(b.cost / Math.max(1, b.totals.calls)).toFixed(4)})`,
  );
};

main();
