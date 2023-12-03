import DocumentConcept from "./concepts/document";
import SectionConcept from "./concepts/section";
import SectionTranslationConcept from "./concepts/sectionTranslation";
import TagConcept from "./concepts/tag";
import TranslationRequestConcept from "./concepts/translationRequest";
import UserConcept from "./concepts/user";
import VoteConcept from "./concepts/vote";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Tag = new TagConcept();
export const TranslationRequest = new TranslationRequestConcept();
export const Document = new DocumentConcept();
export const Section = new SectionConcept();
export const SectionTranslation = new SectionTranslationConcept();
export const Vote = new VoteConcept();
