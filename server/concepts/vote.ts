import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface VoteDoc extends BaseDoc {
  upvote: boolean;
  content: ObjectId;
  user: ObjectId;
}

export default class VoteConcept {
  private readonly votes = new DocCollection<VoteDoc>("votes");

  async vote(content: ObjectId, user: ObjectId, upvote: boolean) {
    const existingVote = await this.votes.readOne({ content, user, upvote });

    if (existingVote) {
      await this.removeVote(content, user, upvote);
    } 
    else {
      await this.votes.createOne({ content, user, upvote });
    }
  }

  async removeVote(content: ObjectId, user: ObjectId, upvote: boolean) {
    await this.votes.deleteOne({ content, user, upvote });
  }

  async countUpvotes(content: ObjectId) {
     const votes = await this.votes.readMany( {content} );
     let total = 0;
     for (const vote of votes){
        if (vote.upvote) total++;
        else total--;
     }
     return total;
  }
}

