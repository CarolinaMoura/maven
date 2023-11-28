import DocumentConcept from "./concepts/document";
import TagConcept from "./concepts/tag";
import TranslationRequestConcept from "./concepts/translationRequest";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";
// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Tag = new TagConcept();
export const TranslationRequests = new TranslationRequestConcept();
export const Document = new DocumentConcept();
