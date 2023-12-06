import { Tag, User } from "./app";
import { DocumentDoc } from "./concepts/document";
import { SectionTranslationDoc } from "./concepts/sectionTranslation";
import { AttachmentDoc } from "./concepts/tag";
import { TranslationRequestDoc } from "./concepts/translationRequest";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /** convert DocumentDoc to readable format by converting tags from ObjectId to name representation */

  static async document(document: DocumentDoc) {
    const languageTag = await Tag.getTag(document.originalLanguage);

    return { ...document, originalLanguage: languageTag?.name };
  }

  static async documents(documents: DocumentDoc[]) {
    const promises = documents.map(async (d) => {
      return await this.document(d);
    });
    return await Promise.all(promises);
  }

  /** convert TranslationRequest doc to readable format by converting requester from ObjectId to name representation */
  static async translationRequest(translationRequest: TranslationRequestDoc) {
    const languageTo = await Tag.getTag(translationRequest.languageTo);
    const requester = await User.getUserById(translationRequest.requester);
    return { ...translationRequest, requester: requester.username, languageTo: languageTo?.name };
  }

  static async translationRequests(translationRequests: TranslationRequestDoc[]) {
    const promises = translationRequests.map(async (t) => {
      return await this.translationRequest(t);
    });
    return await Promise.all(promises);
  }

  static async attachments(attachments: AttachmentDoc[]) {
    const promises = attachments.map(async (a) => {
      return (await Tag.getTag(a.tag))?.name;
    });
    return await Promise.all(promises);
  }

  static async sectionTranslation(sectionTranslation: SectionTranslationDoc) {
    const translator = await User.getUserById(sectionTranslation.translator);
    return { ...sectionTranslation, translator: translator.username };
  }

  static async sectionTranslations(sectionTranslation: SectionTranslationDoc[]) {
    const promises = sectionTranslation.map(async (a) => {
      return await this.sectionTranslation(a);
    });
    return await Promise.all(promises);
  }
}
