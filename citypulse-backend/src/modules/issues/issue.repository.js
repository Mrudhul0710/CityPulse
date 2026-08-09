import { Issue } from "./issue.model.js";

export const issueRepository = {
  async create(data) {
    return Issue.create(data);
  },

  async findById(id) {
    return Issue.findOne({ _id: id, isDeleted: false })
      .populate("reporter", "name email")
      .populate("assignedOfficer", "name email")
      .populate("department", "name");
  },

  async list({ filter = {}, page = 1, limit = 20, sort = "-createdAt" }) {
    const query = { isDeleted: false, ...filter };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Issue.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("reporter", "name")
        .populate("department", "name"),
      Issue.countDocuments(query),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  },

  async addVote(issueId, userId) {
    // $addToSet-style guard via query filter prevents double-voting at the
    // DB level, not just in application logic.
    return Issue.findOneAndUpdate(
      { _id: issueId, isDeleted: false, "votes.user": { $ne: userId } },
      {
        $push: { votes: { user: userId, votedAt: new Date() } },
        $inc: { voteCount: 1 },
      },
      { new: true }
    );
  },

  async removeVote(issueId, userId) {
    return Issue.findOneAndUpdate(
      { _id: issueId, isDeleted: false, "votes.user": userId },
      {
        $pull: { votes: { user: userId } },
        $inc: { voteCount: -1 },
      },
      { new: true }
    );
  },

  async updateStatus(issueId, { status, changedBy, note, extra = {} }) {
    return Issue.findOneAndUpdate(
      { _id: issueId, isDeleted: false },
      {
        $set: { status, ...extra },
        $push: { history: { status, changedBy, note, changedAt: new Date() } },
      },
      { new: true }
    );
  },

  async assignDepartment(issueId, { department, assignedOfficer = null }) {
    return Issue.findOneAndUpdate(
      { _id: issueId, isDeleted: false },
      { $set: { department, assignedOfficer } },
      { new: true }
    );
  },

  async softDelete(issueId, deletedBy) {
    return Issue.findOneAndUpdate(
      { _id: issueId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), deletedBy } },
      { new: true }
    );
  },
};
