# SOLUTION TO THE TASK

## FOLDER STRUCTURE

### CLIENT
`/node-exercise/public/client`

### SERVER
`/node-exercise/src/`

## PROJECT SOLUTION INCLUDES

- **create accounts** (minimum 3)
- **create groups** (minimum 2)
- **associate accounts to group:** That is- fetch from DB all account groups (by accountId) and all group accounts (by groupId).

## Chat Tasks

- **post message to group channel**
- **fetch messages from group channel**
- **handle members states (online, offline):** Client should know who is online on the chat and who is not.
- **handle group channel typing member/s changes:** Client should know if someone is typing at the moment.
- **handle message viewed (as in whatsapp:** Client should know who "saw" his message.

## KINDLY FOLLOW THESE INSTRUCTIONS TO RUN THE PROJECT

### STEP 1
In the root of the project ie cd /node-exercise

RUN  - `npm install`

### STEP 2
open a terminal and run the following command RUN  - 

`nodemon`

### STEP 3
OPEN TWO DIFFERENT BROWSERS AND RUN   
`http://localhost:9000/client/index.html`

### STEP 4
Server base url
`http://localhost:9000/api/`

### Documentation to endpoints can be found here
https://documenter.getpostman.com/view/8854544/UyrBjbvR
