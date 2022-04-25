import chat from "../controllers/chat";

export default (router) => {
  router.route("/chat/:groupId").get(chat.getMessages);
  router.route("/chat").post(chat.postMessage);
};
