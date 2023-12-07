import { Filter, ObjectId } from "mongodb";
import { Document, Section, SectionTranslation, Tag, TranslationRequest, User, Vote, WebSession } from "./app";
import { Author, DocumentDoc } from "./concepts/document";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { Router, getExpressRouter } from "./framework/router";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  /////////////////////
  //       Tag       //
  /////////////////////
  @Router.post("/tag")
  async createTag(name: string, isLanguage: boolean) {
    return await Tag.createTag(name, isLanguage);
  }
  @Router.post("/tag/attach")
  async attachTag(tag: string, attachedTo: string) {
    return await Tag.attachTag(new ObjectId(tag), new ObjectId(attachedTo));
  }
  @Router.get("/tag")
  async getTags() {
    return await Tag.getTags();
  }
  @Router.get("/tag/language")
  async getLanguageTags() {
    return await Tag.getLanguageTags();
  }

  @Router.get("/tag/nonlanguage")
  async getNonLanguageTags() {
    return await Tag.getTags({ isLanguage: false });
  }

  @Router.get("/tag/other")
  async getOtherTags() {
    return await Tag.getOtherTags();
  }

  @Router.get("/tag/object/:object")
  async getObjectTags(object: string) {
    return await Responses.attachments(await Tag.getObjectTags(new ObjectId(object)));
  }
  @Router.get("/tag/tag/:tag")
  async getTaggedObjects(tag: string) {
    return await Tag.getTaggedObjects(new ObjectId(tag));
  }

  ////////////////////
  //    Document    //
  ////////////////////
  @Router.post("/document")
  async createDocument(session: WebSessionDoc, title: string, authors: Author[], year: number, tags: string[], content: string, originalLanguage: string) {
    const user = WebSession.getUser(session);

    const languageId = await Tag.getTagId(originalLanguage);
    if (!(await Tag.checkTagIsLanguage(languageId))) {
      throw new Error("Tag is not a language!");
    }

    const promises = tags.map(async (t) => {
      return await Tag.getTagId(t);
    });
    const tagsId = await Promise.all(promises);

    const documentId = await Document.createDocument(title, authors, year, content, user, languageId);
    await Tag.attachTag(languageId, documentId);

    // attach tags to document
    const tagsPromises = tagsId.map(async (tagId) => {
      return await Tag.attachTag(tagId, documentId);
    });
    await Promise.all(tagsPromises);

    return { msg: "Created document!", _id: documentId };
  }
  @Router.get("/document")
  async getDocuments() {
    return await Responses.documents(await Document.filterDocuments({}));
  }
  @Router.get("/document/:id")
  async getDocument(id: string) {
    return await Responses.document(await Document.getDocument(new ObjectId(id)));
  }

  @Router.delete("/document/:id")
  async deleteDocument(session: WebSessionDoc, id: string) {
    const user = WebSession.getUser(session);
    const document = await Document.getDocument(new ObjectId(id));
    if (!user.equals(document.uploader)) {
      throw new Error("You did not upload this document!");
    }
    await Tag.deleteTagAttachment(document.originalLanguage, document._id);
    return await Document.deleteDocument(new ObjectId(id));
  }

  /////////////////////
  //     Section     //
  /////////////////////
  @Router.get("/section/:id")
  async getSection(id: ObjectId) {
    return await Section.getSection(id);
  }

  @Router.get("/section")
  async getSections() {
    return await Section.getSections();
  }

  @Router.get("/section")
  async splitIntoSections(text: string) {
    return await Section.splitIntoSections(text);
  }

  ////////////////////////////////
  //     SectionTranslation     //
  ////////////////////////////////
  @Router.get("/sectionTranslation/:section")
  async getAllSectionTranslations(section: string) {
    const sectionTranslations = await SectionTranslation.getSectionTranslations({ section: new ObjectId(section) });
    const translationsWithVotes = await Promise.all(
      sectionTranslations.map(async (translation) => {
        let name = "";
        try {
          const user = await User.getUserById(translation.translator).then((user) => user.username);
          name = user;
        } catch (e) {
          name = "Deleted user";
        }
        const upvotes = await Vote.countUpvotes(translation._id);
        return {
          translatorName: name,
          upvotes,
          ...translation,
        };
      }),
    );
    const sortedTranslations = translationsWithVotes.sort((a, b) => b.upvotes - a.upvotes);
    return await Responses.sectionTranslations(sortedTranslations);
  }

  @Router.get("/sectionTranslation/byId/:id")
  async getSectionTranslation(id: string) {
    return await Responses.sectionTranslation(await SectionTranslation.getSectionTranslation(new ObjectId(id)));
  }
  @Router.post("/sectionTranslation")
  async createSectionTranslation(session: WebSessionDoc, translation: string, section: string) {
    const user = WebSession.getUser(session);
    const sectionId = new ObjectId(section);
    await Section.checkSectionExists(sectionId);
    return await SectionTranslation.createSectionTranslation(user, translation, sectionId);
  }

  @Router.patch("/sectionTranslation")
  async updateSectionTranslation(session: WebSessionDoc, id: string, translation: string) {
    const user = WebSession.getUser(session);
    await SectionTranslation.checkSectionTranslationExists(new ObjectId(id));
    const sectionTranslation = await SectionTranslation.getSectionTranslation(new ObjectId(id));
    if (!user.equals(sectionTranslation.translator)) {
      throw new Error("This translation is not yours!");
    }
    return { sectionTranslation: await SectionTranslation.updateSectionTranslation(new ObjectId(id), translation), msg: "Translation updated successfully!" };
  }

  @Router.delete("/sectionTranslation/:id")
  async deleteSectionTranslation(session: WebSessionDoc, id: string) {
    const user = WebSession.getUser(session);
    await SectionTranslation.checkSectionTranslationExists(new ObjectId(id));
    const sectionTranslation = await SectionTranslation.getSectionTranslation(new ObjectId(id));
    if (!user.equals(sectionTranslation.translator)) {
      throw new Error("This translation is not yours!");
    }
    return await SectionTranslation.deleteSectionTranslation(new ObjectId(id));
  }

  ////////////////////////////
  //   TranslationRequest   //
  ////////////////////////////
  @Router.post("/translationRequest")
  async createTranslationRequest(session: WebSessionDoc, document: string, languageTo: string, description: string) {
    const user = WebSession.getUser(session);
    const documentId = new ObjectId(document);

    const languageId = await Tag.getTagId(languageTo);
    if (!(await Tag.checkTagIsLanguage(languageId))) {
      throw new Error("Tag is not a language!");
    }

    const documentDoc = await Document.getDocument(documentId);
    const sections = await Section.splitIntoSections(documentDoc.content);
    const translationRequest = await TranslationRequest.createTranslationRequest(documentId, sections, languageId, user, description);
    await Tag.attachTag(languageId, translationRequest);
    return { msg: "Created translation request!" };
  }

  @Router.delete("/translationRequest/:id")
  async deleteTranslationRequest(session: WebSessionDoc, id: string) {
    const user = WebSession.getUser(session);
    const request = await TranslationRequest.getTranslationRequest(new ObjectId(id));
    if (!user.equals(request.requester)) {
      throw new Error("You did not create this request!");
    }

    // get translation request and list of section ids
    const translationRequest = await TranslationRequest.getTranslationRequest(new ObjectId(id));
    const sections = translationRequest.sections;

    // get section translations based on section ids
    const sectionTanslationPromises = sections.map(async (s) => {
      return await SectionTranslation.getSectionTranslations({ section: s });
    });

    // delete all section translations
    const sectionTranslations = await Promise.all(sectionTanslationPromises);
    const flattenedSectionTranslations = sectionTranslations.flatMap((arr) => {
      return arr;
    });
    const deleteTranslationPromises = flattenedSectionTranslations.map(async (t) => {
      return await SectionTranslation.deleteSectionTranslation(t._id);
    });

    await Promise.all(deleteTranslationPromises);

    // delete all sections
    const deleteSectionPromises = sections.map(async (id) => {
      return await Section.deleteSection(id);
    });
    await Promise.all(deleteSectionPromises);

    // delete tag attachments
    await Tag.deleteTagAttachment(request.languageTo, request._id);

    // delete translation request
    return await TranslationRequest.deleteTranslationRequest(new ObjectId(id));
  }

  @Router.get("/translationRequest")
  async getTranslationRequests() {
    return await Responses.translationRequests(await TranslationRequest.getTranslationRequests({}));
  }

  @Router.get("/translationRequest/:id")
  async getTranslationRequest(id: string) {
    return await Responses.translationRequest(await TranslationRequest.getTranslationRequest(new ObjectId(id)));
  }

  ///////////////////
  //    Upvote    //
  //////////////////
  @Router.get("/votes")
  async getVotes(section: string) {
    return await Vote.countUpvotes(new ObjectId(section));
  }

  @Router.get("/votes/myVote")
  async getMyVote(session: WebSessionDoc, section: string) {
    const user = WebSession.getUser(session);
    return await Vote.getMyVote(new ObjectId(section), user);
  }
  @Router.post("/votes/vote")
  async vote(session: WebSessionDoc, section: string, upvote: boolean) {
    const user = WebSession.getUser(session);
    return await Vote.vote(new ObjectId(section), user, upvote);
  }

  @Router.delete("/votes/removeVote")
  async removeVote(session: WebSessionDoc, section: string) {
    const user = WebSession.getUser(session);
    await Vote.removeVote(new ObjectId(section), user);
    return { msg: "Vote removed!" };
  }

  // Exporting the translation
  @Router.post("/export")
  async export(chosenTranslations: Array<ObjectId>) {
    console.log(chosenTranslations);
    const translations = await Promise.all(chosenTranslations.map(async (chosenTranslation) => SectionTranslation.getSectionTranslation(chosenTranslation)));
    console.log(translations);
    return translations.reduce((acc, cur) => acc + cur.translation + " ", "");
  }

  @Router.get("/getTranslation/byUpvotes/:id")
  async getTranslationByUpvotes(id: string) {
    const sectionId = new ObjectId(id);
    const sectionTranslations = await SectionTranslation.getSectionTranslations({ section: sectionId });
    if (sectionTranslations.length === 0) {
      return { found: false };
    } else {
      const popularTranslation = await Vote.getMostUpvoted(sectionTranslations.map((t) => t._id));
      return { found: true, translation: popularTranslation };
    }
  }

  ////////////////
  //   User   //
  ////////////////
  @Router.get("/user/requests/:username")
  async getUserRequests(username: string) {
    const user = await User.getUserByUsername(username);
    return await Responses.translationRequests(await TranslationRequest.getTranslationRequests({ requester: new ObjectId(user._id) }));
  }

  @Router.get("/user/contributions/:username")
  async getUserTranslations(username: string) {
    const user = await User.getUserByUsername(username);
    const translations = await Responses.sectionTranslations(await SectionTranslation.getSectionTranslationsByTranslator(user._id));

    const sections = await Promise.all(
      translations.map(async (t) => {
        return await Section.getSection(t.section);
      }),
    );

    const requests = await Promise.all(
      sections.map(async (s) => {
        return await Responses.translationRequest(await TranslationRequest.getTranslationRequestBySection(s._id));
      }),
    );

    const documents = await Promise.all(
      requests.map(async (r) => {
        return await Responses.document(await Document.getDocument(r.document));
      }),
    );

    return { requests, sections, translations, documents };
  }

  ////////////////
  //   Filter   //
  ////////////////
  @Router.put("/filter")
  async filterDocuments(filter: IFilter) {
    const infYear = 10000000000;

    if (filter.yearFrom === undefined) {
      filter.yearFrom = -infYear;
    }
    if (filter.yearTo === undefined) {
      filter.yearTo = infYear;
    }

    let docIds: ObjectId[];
    // filter by tags
    if (filter.tags !== undefined && filter.tags.length > 0) {
      const objectTags = filter.tags.map((tag) => new ObjectId(tag));
      const attachments = await Tag.getAttachments({ tag: { $in: objectTags } });
      docIds = attachments.map(({ attachedTo }) => attachedTo);
    } else {
      docIds = (await Document.filterDocuments({})).map((doc) => doc._id);
    }

    // filter by document
    const queryDocs: Filter<DocumentDoc> = {
      $or: [
        { _id: { $in: docIds }, year: { $gte: filter.yearFrom, $lte: filter.yearTo } },
        { _id: { $in: docIds }, year: { $eq: null } },
      ],
    };

    let ok = false;

    for (const t of filter.translations ?? []) {
      ok ||= t.from === "0";
    }

    if (filter.translations !== undefined && filter.translations.length && !ok) {
      const from = filter.translations.map(({ from }) => new ObjectId(from));
      queryDocs.originalLanguage = { $in: from };
    }
    const docs = await Document.filterDocuments(queryDocs);
    if (filter.translations === undefined || filter.translations.length === 0) {
      return await Responses.translationRequests(await TranslationRequest.getTranslationRequests({ document: { $in: docs.map(({ _id }) => _id) } }));
    }

    const fromTo: Map<string, Set<string>> = new Map([["0", new Set<string>()]]);

    for (const { from, to } of filter.translations) {
      fromTo.get("0")?.add(to);
      if (fromTo.has(from)) {
        fromTo.get(from)?.add(to);
      } else {
        fromTo.set(from, new Set([to]));
      }
    }

    const setLanguagesEveryone = fromTo.get("0") ?? [];

    // filter by translation request
    const toReturn = [];
    for (const doc of docs) {
      // get the specifics of the document
      const setLanguagesDocument = fromTo.get(doc.originalLanguage.toString()) ?? [];
      const possibleToLanguage = [...setLanguagesDocument, ...setLanguagesEveryone];

      if (possibleToLanguage.includes("0")) {
        toReturn.push(...(await Responses.translationRequests(await TranslationRequest.getTranslationRequests({ document: doc._id }))));
      } else {
        const queryTranslationRequest = {
          document: doc._id,
          languageTo: { $in: possibleToLanguage.map((id) => new ObjectId(id)) },
        };
        const result = await Responses.translationRequests(await TranslationRequest.getTranslationRequests(queryTranslationRequest));
        toReturn.push(...result);
      }
    }

    return toReturn;
  }
}

interface IFilter {
  translations?: { from: string; to: string }[];
  yearFrom?: number;
  yearTo?: number;
  completelyTranslated?: boolean;
  untranslated?: boolean;
  tags?: string[];
}

export default getExpressRouter(new Routes());
