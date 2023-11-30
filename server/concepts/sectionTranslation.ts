import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SectionTranslationDoc extends BaseDoc {
  translator: ObjectId;
  translation: string;
  section: ObjectId;
}

export default class SectionConcept {
  private readonly sectionTranslations = new DocCollection<SectionTranslationDoc>("sectionTranslations");

  async createSectionTranslation(translator: ObjectId, translation: string, section: ObjectId) {
    await this.sectionTranslations.createOne({ translator, translation, section });
    return { msg: "Created section translation!" };
  }
  async getSectionTranslations(filter: Filter<SectionTranslationDoc>) {
    return await this.sectionTranslations.readMany(filter);
  }
  async getSectionTranslation(id: ObjectId) {
    const sectionTranslation = await this.sectionTranslations.readOne({ _id: id });
    if (sectionTranslation === null) {
      throw new Error("Section translation not found!");
    }
    return sectionTranslation;
  }
}
