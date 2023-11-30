import { TagDoc } from "./concepts/tag";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert TagDoc into more readable format for the frontend by only returning the name of the tag.
   */
  static tag(tag: TagDoc) {
    if (!tag) {
      return tag;
    }
    return { name: tag.name };
  }

  /**
   * Converts array of TagDoc into more readable format for the frontend by only returning the name of the tag.
   */
  static tags(tags: Array<TagDoc>) {
    return tags.map((t) => this.tag(t));
  }
}
