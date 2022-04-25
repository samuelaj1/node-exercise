import group from "../controllers/group";

export default (router) => {
  router.route("/group").post(group.create);
  router.route("/join-group").post(group.join);
  router.route("/groups").get(group.getGroups);
  router.route("/get-group/:group_id").get(group.getGroupById);
};
