import crypto from "crypto";
import fs from "fs/promises";

class MysteryGenerator {
  private getRandomString(length: number): string {
    return crypto.randomBytes(length).toString("base64");
  }

  private encodeWithDate(input: string): string {
    const date = new Date();
    const dateKey = date.getDate() + date.getMonth() + date.getFullYear();

    return input
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) + dateKey))
      .join("");
  }

  private async generateContent(): Promise<string> {
    const timestamp = Date.now();
    const randomData = this.getRandomString(32);
    const hash = crypto
      .createHash("sha256")
      .update(`${timestamp}-${randomData}`)
      .digest("base64");

    const layer1 = Buffer.from(hash).toString("base64");
    const layer2 = crypto
      .createHmac("sha512", randomData)
      .update(layer1)
      .digest("base64");

    return this.encodeWithDate(layer2);
  }

  public async createMysteryFile(): Promise<void> {
    try {
      const content = await this.generateContent();
      await fs.writeFile("mysterious_file.txt", content);
      console.log("Mystery file created successfully!");
    } catch (error) {
      console.error("Error creating mystery file:", error);
    }
  }
}

const generator = new MysteryGenerator();
generator.createMysteryFile();
