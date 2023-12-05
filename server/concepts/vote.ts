import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface VoteDoc extends BaseDoc {
  upvotedObject: ObjectId;
  user: ObjectId;
  isUpvote: boolean;
}

export default class VoteConcept {
  private readonly votes = new DocCollection<VoteDoc>("votes");

  async vote(upvotedObject: ObjectId, user: ObjectId, isUpvote: boolean) {
    const existingVote = await this.votes.readOne({ upvotedObject, user });

    if (existingVote) {
      await this.removeVote(upvotedObject, user);
    }
    await this.votes.createOne({ upvotedObject, user, isUpvote });

    return { msg: "Vote updated successfully!" };
  }

  async getMyVote(upvotedObject: ObjectId, user: ObjectId) {
    const vote = await this.votes.readOne({ upvotedObject, user });
    if (!vote) {
      return "NONE";
    } else if (vote.isUpvote) {
      return "UPVOTE";
    } else {
      return "DOWNVOTE";
    }
  }

  async removeVote(upvotedObject: ObjectId, user: ObjectId) {
    await this.votes.deleteMany({ upvotedObject, user });
  }

  async countUpvotes(upvotedObject: ObjectId) {
    const votes = await this.votes.readMany({ upvotedObject });
    const total = votes.reduce((acc, vote) => acc + (vote.isUpvote ? 1 : -1), 0);
    return total;
  }

  // Sort in descending order of upvotes, then by timestamp if tie (increasing)
  async sortByUpvotes(upvotedObjects: ObjectId[]) {
    const objectWithUpvotes = await Promise.all(
      upvotedObjects.map(async (upvotedObject) => {
        const upvotes = await this.countUpvotes(upvotedObject);
        return { upvotedObject, upvotes };
      }),
    );
    return objectWithUpvotes
      .sort((a, b) => {
        if (a.upvotes !== b.upvotes) return b.upvotes - a.upvotes;
        else return a.upvotedObject.getTimestamp().getTime() - b.upvotedObject.getTimestamp().getTime();
      })
      .map((obj) => obj.upvotedObject);
  }

  async getMostUpvoted(upvotedObjects: ObjectId[]) {
    const sorted = await this.sortByUpvotes(upvotedObjects);
    return sorted[0];
  }
}
