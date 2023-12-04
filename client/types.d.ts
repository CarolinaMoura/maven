export interface Author {
  first: string;
  last: string;
}

export interface Tag {
  name: string;
  isLanguage: boolean;
  _id?: string;
}

export interface IFilter {
  translations?: { from: string; to: string }[];
  yearFrom?: number;
  yearTo?: number;
  completelyTranslated?: boolean;
  untranslated?: boolean;
  tags?: string[];
}

export interface TranslationRequest {
  document: string;
  sections: Array<string>;
  languageTo: string;
  requester: string;
  _id: string;
}
