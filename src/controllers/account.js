import db from "../services/db";

export default {
  create: async (req, res) => {
    console.log("create account", req.body);
    const account = await db.createAccount(req.body);
    res.status(200).json(account);
  },
  getAllAccounts: async (req, res) => {
    const account = await db.getAllAccounts();
    res.status(200).json(account);
  },

  getAccountById: async (req, res) => {
    const {account_id} = req.params;
    const account = await db.getAccountByAccountId(account_id);
    res.status(200).json(account);
  },
};
