import { Tag, User } from "./app";
import { DocumentDoc } from "./concepts/document";
import { TranslationRequestDoc } from "./concepts/translationRequest";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /** convert DocumentDoc to readable format by converting tags from ObjectId to name representation */

  static async document(document: DocumentDoc) {
    const languageTag = await Tag.getTag(document.originalLanguage);
    const promises = document.tags.map(async (t) => {
      return (await Tag.getTag(t))?.name;
    });
    const tags = await Promise.all(promises);
    return { ...document, originalLanguage: languageTag?.name, tags };
  }

  static async documents(documents: DocumentDoc[]) {
    const promises = documents.map(async (d) => {
      return await this.document(d);
    });
    return await Promise.all(promises);
  }

  /** convert TranslationRequest doc to readable format by converting requester from ObjectId to name representation */
  static async translationRequest(translationRequest: TranslationRequestDoc) {
    const requester = translationRequest.requester;
    const user = await User.getUserById(requester);
    return { ...translationRequest, requester: user.username };
  }

  static async translationRequests(translationRequests: TranslationRequestDoc[]) {
    const promises = translationRequests.map(async (t) => {
      return await this.translationRequest(t);
    });
    return await Promise.all(promises);
  }
}
