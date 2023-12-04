import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface VoteDoc extends BaseDoc {
  upvote: boolean;
  section: ObjectId;
  user: ObjectId;
}

export default class VoteConcept {
  private readonly votes = new DocCollection<VoteDoc>("votes");

  async vote(section: ObjectId, user: ObjectId, upvote: boolean) {
    const existingVote = await this.votes.readOne({ section, user, upvote });

    if (existingVote) {
      await this.removeVote(section, user, upvote);
    } 
    else {
      await this.votes.createOne({ section, user, upvote });
    }
  }

  async removeVote(section: ObjectId, user: ObjectId, upvote: boolean) {
    await this.votes.deleteOne({ section, user, upvote });
  }

  async countUpvotes(section: ObjectId) {
     const votes = await this.votes.readMany( {section} );
     const total = votes.reduce((acc, vote) => acc + (vote.upvote ? 1 : -1), 0);
     return total;
  }
}

