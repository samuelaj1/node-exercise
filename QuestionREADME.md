# Circles node-exercise (chat)

In this exercise you will need to add logic to that application so we could perform both **Initial task** and **Chat tasks** by using Rest http requests.

At the end of the exercise you will need to supply the list of the http requests you used. You could also provide logs.

### Services

Both `db.js` and `redis.js` "store" data on RAM and NOT using a real servers.

##### DB

You will need to implement DB methods which ilustrate the conneciton between the DB server and the node application. Please implement the new methods in the same manner as the exsiting methods implemented right now, means, every method return a Promise.

(After creating schemes for the relevant tables and implement the Api to these tables you can write hard coded data in these tables, so when you will restart the node, you will start with existing data)

## Initial Tasks

- **create accounts** (minimum 3)
- **create groups** (minimum 2)
- **associate accounts to group:** We would like to be able to fetch from DB all account groups (by accountId) and all group accounts (by groupId).

## Chat Tasks (Nice to have)

- **post message to group channel**
- **fetch messages from group channel**
- **handle members states (online, offline):** Client should know who is online on the chat and who is not.
- **handle group channel typing member/s changes:** Client should know if someone is typing at the moment.
- **handle message viewed (as in whatsapp:** Client should know who "saw" his message.

These tasks require to expend the scheme of **Messages** table, and/or to create new table/s, using **Redis** in a good manner. It's all up to you, feel free to implement it in the best way you can think of.
