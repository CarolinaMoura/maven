import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface TagDoc extends BaseDoc {
  name: string;
  isLanguage: boolean;
}

export interface AttachmentDoc extends BaseDoc {
  tag: ObjectId;
  attachedTo: ObjectId;
}

export default class TagConcept {
  private readonly tags = new DocCollection<TagDoc>("tags");
  private readonly attachments = new DocCollection<AttachmentDoc>("tagAttachments");

  async createTag(name: string, isLanguage: boolean) {
    const existing = await this.tags.readOne({ name });
    if (existing !== null) {
      throw new Error("Tag already exists!");
    }
    const tagId = await this.tags.createOne({ name, isLanguage });
    return { msg: "Created tag!", tagId: tagId };
  }

  async getTag(_id: ObjectId) {
    return await this.tags.readOne({ _id });
  }

  async getTags(filter: Filter<TagDoc> = {}) {
    return await this.tags.readMany(filter);
  }
  async getLanguageTags() {
    return await this.tags.readMany({ isLanguage: true });
  }
  async checkTagIsLanguage(tag: ObjectId) {
    const tagDoc = await this.tags.readOne({ _id: tag });
    if (tagDoc === null) {
      throw new Error("Tag not found!");
    }
    return tagDoc.isLanguage;
  }

  async getTagId(name: string, isLanguage: boolean) {
    const tagDoc = await this.tags.readOne({ name, isLanguage });
    if (tagDoc === null) {
      throw new Error(`Tag ${name} not found!`);
    }
    return tagDoc._id;
  }

  async attachTag(tag: ObjectId, attachedTo: ObjectId) {
    await this.attachments.createOne({ tag, attachedTo });
    return { msg: "Attached tag!" };
  }
  async getObjectTags(attachedTo: ObjectId) {
    return await this.attachments.readMany({ attachedTo });
  }
  async getTaggedObjects(tag: ObjectId) {
    return await this.attachments.readMany({ tag });
  }
  async deleteTagAttachment(tag: ObjectId, attachedTo: ObjectId) {
    await this.attachments.deleteOne({ tag, attachedTo });
    return { msg: "Deleted tag attachment!" };
  }
}
