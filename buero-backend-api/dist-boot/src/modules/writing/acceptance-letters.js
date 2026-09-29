"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCEPTANCE_LETTERS = void 0;
exports.ACCEPTANCE_LETTERS = [
    {
        id: "L1",
        title: "еталон",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um\nzehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass\nich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 1, 1, 1],
        expectedTotal: 6,
    },
    {
        id: "L2",
        title: "після `weil` дієслово не в кінці",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich habe Fieber. Die Besprechung um\nzehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass\nich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 0, 1, 1, 1, 1],
        expectedTotal: 5,
    },
    {
        id: "L3",
        title: "після `dass` дієслово не в кінці",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um\nzehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass\nich bin am Mittwoch wieder gesund. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 0, 1, 1, 1],
        expectedTotal: 5,
    },
    {
        id: "L4",
        title: "речення з `wenn` немає взагалі",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um\nzehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass\nich am Mittwoch wieder gesund bin. Ich melde mich morgen wieder bei Ihnen.\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 0, 1, 1],
        expectedTotal: 5,
    },
    {
        id: "L5",
        title: "`das` написано як `dass`",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um\nzehn muss ich leider absagen. Dass tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass\nich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort Bescheid.\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 1, 0, 1],
        expectedTotal: 5,
    },
    {
        id: "L6",
        title: "закороткий лист, немає формули прощання",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin krank. Ich komme heute nicht. Die Besprechung muss ich absagen.",
        expected: [0, 0, 0, 0, 1, 0],
        expectedTotal: 1,
    },
    {
        id: "L7",
        title: "усі конструкції на місці, але тон невічливий",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich komme heute nicht, weil ich krank bin. Die Besprechung sage ich ab. Das ist jetzt so. Ich\nhoffe, dass Sie das verstehen. Wenn ich wieder gesund bin, komme ich. Mehr kann ich nicht\nmachen. Das ist alles.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 1, 1, 0],
        expectedTotal: 5,
    },
    {
        id: "L8",
        title: "помилка, якої немає в рубриці",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um\nzehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zu der Arzt. Ich hoffe,\ndass ich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, sage ich Ihnen sofort\nBescheid. Vielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 1, 1, 1],
        expectedTotal: 6,
    },
    {
        id: "L9",
        title: "після `wenn`-речення немає інверсії в головному",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nich bin heute krank und kann nicht zur Arbeit kommen, weil ich Fieber habe. Die Besprechung um\nzehn muss ich leider absagen. Das tut mir sehr leid. Ich gehe heute zum Arzt. Ich hoffe, dass\nich am Mittwoch wieder gesund bin. Wenn ich länger krank bin, ich sage Ihnen sofort Bescheid.\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 0, 1, 1],
        expectedTotal: 5,
    },
    {
        id: "L10",
        title: "правильний лист зі складнішими конструкціями",
        letter: "Betreff: Krankmeldung\n\nSehr geehrte Frau Schmidt,\n\nweil ich seit gestern Fieber habe, kann ich heute leider nicht zur Arbeit kommen. Die\nBesprechung um zehn Uhr möchte ich deshalb auf Donnerstag verschieben. Das tut mir sehr leid.\nIch weiß, dass das Projekt gerade sehr wichtig ist. Ich hoffe, dass ich am Donnerstag wieder\narbeiten kann. Wenn Sie Fragen haben, können Sie mir gern eine E-Mail schreiben. Vielen Dank\nfür Ihr Verständnis.\n\nMit freundlichen Grüßen\nOlha Kovalenko",
        expected: [1, 1, 1, 1, 1, 1],
        expectedTotal: 6,
    },
];
//# sourceMappingURL=acceptance-letters.js.map