import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface TranslationRequestDoc extends BaseDoc {
  document: ObjectId;
  sections: Array<ObjectId>;
  languageTo: ObjectId;
  requester: ObjectId;
}

export default class TranslationRequestConcept {
  private readonly translationRequests = new DocCollection<TranslationRequestDoc>("translationRequests");

  async createTranslationRequest(document: ObjectId, sections: Array<ObjectId>, languageTo: ObjectId, requester: ObjectId) {
    await this.translationRequests.createOne({ document, sections, languageTo, requester });
    return { msg: "Created translation request!" };
  }
  async deleteTranslationRequest(id: ObjectId) {
    await this.translationRequests.deleteOne({ _id: id });
    return { msg: "Deleted translation request!" };
  }
}
