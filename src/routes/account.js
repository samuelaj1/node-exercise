import account from "../controllers/account";
import group from "../controllers/group";

export default (router) => {
  router.route("/account").post(account.create);
  router.route("/accounts").get(account.getAllAccounts);
  router.route("/get-account/:account_id").get(account.getAccountById);

};
