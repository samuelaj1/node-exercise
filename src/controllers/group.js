import db from "../services/db";

export default {
  create: async (req, res) => {

    const group = await db.createGroup(req.body);
    res.status(200).json(group);
  },

  join: async (req, res) => {
    const group = await db.joinGroup(req.body);
    res.status(200).json(group);
  },
  getGroups: async (req, res) => {
    const group = await db.getAllGroups();
    res.status(200).json(group);
  },
  getGroupById: async (req, res) => {
   const {group_id} = req.params;
    const group = await db.getByGroupId(group_id);
    res.status(200).json(group);
  },
};
