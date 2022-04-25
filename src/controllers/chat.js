import db from "../services/db";
import redis from "../services/redis";

export default {
  getMessages: async (req, res) => {
    const { groupId } = req.params;
    const messages = await db.getMessagesByGroup(groupId);
    res.status(200).json(messages);
  },

  postMessage: async (req, res) => {
    const messages = await db.addNewMessage(req.body);
    res.status(200).json(messages);
  },
};
