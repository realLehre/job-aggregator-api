import { PDFParse } from "pdf-parse";

const extractResumeText = async (buffer: Buffer) => {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
};

export default extractResumeText;
