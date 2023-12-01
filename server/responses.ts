import { Tag } from "./app";
import { DocumentDoc } from "./concepts/document";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /** convert DocumentDoc to readable format by converting tags from ObjectId to name representation */

  static async document(document: DocumentDoc) {
    const languageTag = await Tag.getTag(document.originalLanguage);
    const domainTag = await Tag.getTag(document.domain);
    return { ...document, originalLanguage: languageTag?.name, domain: domainTag?.name };
  }

  static async documents(documents: DocumentDoc[]) {
    console.log("HERE");
    const promises = documents.map(async (d) => {
      return await this.document(d);
    });
    return await Promise.all(promises);
  }
}
