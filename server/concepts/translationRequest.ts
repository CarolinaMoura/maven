import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface TranslationRequestDoc extends BaseDoc {
  document: ObjectId;
  sections: Array<ObjectId>;
  languageTo: ObjectId;
  requester: ObjectId;
  description: String;
}

export default class TranslationRequestConcept {
  private readonly translationRequests = new DocCollection<TranslationRequestDoc>("translationRequests");

  async createTranslationRequest(document: ObjectId, sections: Array<ObjectId>, languageTo: ObjectId, requester: ObjectId, description: string) {
    return await this.translationRequests.createOne({ document, sections, languageTo, requester, description });
  }
  async deleteTranslationRequest(id: ObjectId) {
    await this.translationRequests.deleteOne({ _id: id });
    return { msg: "Deleted translation request!" };
  }

  async getTranslationRequests(filter: Filter<TranslationRequestDoc> = {}) {
    return await this.translationRequests.readMany(filter);
  }

  async getTranslationRequest(_id: ObjectId) {
    const document = await this.translationRequests.readOne({ _id });
    if (document === null) {
      throw new Error("Document not found!");
    }
    return document;
  }
}
