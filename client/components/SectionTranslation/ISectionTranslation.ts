import { ObjectId } from "mongodb";

export interface ISectionTranslation {
  translation: string;
  translator: ObjectId;
  section: ObjectId;
}
