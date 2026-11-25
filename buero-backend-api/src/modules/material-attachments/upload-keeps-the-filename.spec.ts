import {
  MATERIAL_ATTACHMENT_MAX_BYTES,
  materialAttachmentMulterOptions,
} from "./multer-material-attachment.config";

/**
 * The name a file arrives with is the name it keeps.
 *
 * Multer decodes the filename out of the upload's headers, and defaults to `latin1` for
 * it - literally `this.defParamCharset = options.defParamCharset || 'latin1'`. Browsers
 * send UTF-8. Every byte outside ASCII therefore becomes the wrong character, and the
 * mangled name is what gets stored and what a student later downloads.
 *
 * What made it hard to notice is that it depends on the file. `Buro_de-A2.1-1.1-Shpargalka.pdf`
 * is ASCII from end to end and passes through untouched; `Шпаргалка.pdf` does not. The
 * first file a teacher attached looked perfectly fine.
 *
 * One word fixes it and nothing on screen shows whether the word is there, which is the
 * whole reason for this test.
 */
describe("uploading a lesson file", () => {
  it("reads the file name as UTF-8, the way browsers send it", () => {
    expect(
      (materialAttachmentMulterOptions as { defParamCharset?: string })
        .defParamCharset,
    ).toBe("utf8");
  });

  /** Demonstrates what the default does, so the line above is not a magic string. */
  it("would otherwise mangle anything that is not ASCII", () => {
    const sent = "Шпаргалка.pdf";
    const asLatin1 = Buffer.from(sent, "utf8").toString("latin1");

    expect(asLatin1).not.toBe(sent);
    /** And reading those same bytes back as UTF-8 is exactly what the fix does. */
    expect(Buffer.from(asLatin1, "latin1").toString("utf8")).toBe(sent);
  });

  it("still refuses a file over the limit", () => {
    expect(materialAttachmentMulterOptions.limits?.fileSize).toBe(
      MATERIAL_ATTACHMENT_MAX_BYTES,
    );
  });
});
