import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface Author {
  first: string;
  last: string;
}
export interface DocumentDoc extends BaseDoc {
  title: string;
  authors: Author[];
  year?: number | null;
  content: string;
  uploader: ObjectId;
  originalLanguage: ObjectId;
}

export default class DocumentConcept {
  private readonly documents = new DocCollection<DocumentDoc>("documents");

  async createDocument(title: string, authors: Author[], year: number | null, content: string, uploader: ObjectId, originalLanguage: ObjectId) {
    return await this.documents.createOne({ title, authors, content, year, uploader, originalLanguage });
  }

  async filterDocuments(filter: Filter<DocumentDoc>): Promise<DocumentDoc[]> {
    return await this.documents.readMany(filter);
  }

  async getDocument(id: ObjectId) {
    const document = await this.documents.readOne({ _id: id });
    if (document === null) {
      throw new Error("Document not found!");
    }
    return document;
  }
  async deleteDocument(id: ObjectId) {
    await this.documents.deleteOne({ _id: id });
    return { msg: "Deleted document!" };
  }
}
