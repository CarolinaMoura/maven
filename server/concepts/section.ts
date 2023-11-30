import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SectionDoc extends BaseDoc {
  text: string;
}

export default class SectionConcept {
  private readonly sections = new DocCollection<SectionDoc>("sections");

  async createSection(text: string) {
    await this.sections.createOne({ text });
    return { msg: "Created section!" };
  }
  async getSections() {
    return await this.sections.readMany({});
  }
  async getSection(id: ObjectId) {
    console.log(id);
    const section = await this.sections.readOne({ _id: id });
    if (!section) {
      throw new Error("Section not found!");
    }
    return section;
  }
  async checkSectionExists(id: ObjectId) {
    const section = await this.sections.readOne({ _id: id });
    if (section === null) {
      throw new Error("Section not found!");
    }
  }

  async splitIntoSections(text: string) {
    const sentences = text.split(/(?<=[.?!])\s+(?=[A-Z])/);
    const sections = [];
    let curSection = "";
    for (const sentence of sentences) {
      curSection += sentence;
      if (curSection.length > 400) {
        sections.push(curSection);
        curSection = "";
      }
    }
    if (curSection.length > 0) {
      sections.push(curSection);
    }

    return await Promise.all(sections.map((section) => this.sections.createOne({ text: section })));
  }
}
