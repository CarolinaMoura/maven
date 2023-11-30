import { ObjectId } from "mongodb";
import { Document, Section, SectionTranslation, Tag, User, WebSession } from "./app";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { Router, getExpressRouter } from "./framework/router";

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

  // Tag routes
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
  @Router.get("/tag/object/:object")
  async getObjectTags(object: string) {
    return await Tag.getObjectTags(new ObjectId(object));
  }
  @Router.get("/tag/tag/:tag")
  async getTaggedObjects(tag: string) {
    return await Tag.getTaggedObjects(new ObjectId(tag));
  }

  // Document routes
  @Router.post("/document")
  async createDocument(session: WebSessionDoc, title: string, author: string, content: string, originalLanguage: string) {
    const user = WebSession.getUser(session);
    const languageId = await Tag.getTagId(originalLanguage);
    if (!(await Tag.checkTagIsLanguage(languageId))) {
      throw new Error("Tag is not a language!");
    }
    return await Document.createDocument(title, author, content, user, languageId);
  }
  @Router.get("/document")
  async getDocuments() {
    return await Document.getDocuments();
  }
  @Router.get("/document/:id")
  async getDocument(id: string) {
    return await Document.getDocument(new ObjectId(id));
  }
  @Router.delete("/document/:id")
  async deleteDocument(session: WebSessionDoc, id: string) {
    const user = WebSession.getUser(session);
    const document = await Document.getDocument(new ObjectId(id));
    if (!user.equals(document.uploader)) {
      throw new Error("You did not upload this document!");
    }
    return await Document.deleteDocument(new ObjectId(id));
  }

  // Section routes
  @Router.get("/section")
  async getSections() {
    return await Section.getSections();
  }

  // Section Translation
  @Router.post("/sectionTranslation")
  async createSectionTranslation(session: WebSessionDoc, translation: string, section: string) {
    const user = WebSession.getUser(session);
    const sectionId = new ObjectId(section);
    await Section.checkSectionExists(sectionId);
    return await SectionTranslation.createSectionTranslation(user, translation, sectionId);
  }
}

export default getExpressRouter(new Routes());
