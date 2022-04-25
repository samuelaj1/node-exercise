import {v4 as uuidv4} from "uuid";
import singleton from "../utils/singleton";

const _ = require('lodash')
/**
 * account: { id, name, email }
 * group: { id, name }
 * member: { id, accountId, groupId }
 * message: { id, message, groupId, accountId }
 */

const db = {
    messages: [],
    accounts: [],
    members: [],
    groups: [],
    account_group: [],
};

function Db() {
    function createAccount(props) {
        const id = uuidv4();
        const online_status = false;
        const account = {...props, online_status, id};
        let userExist = db.accounts.find(account => account.name === props.name);
        if (!userExist) {
            db.accounts.push(account);
            return Promise.resolve(account);
        }
        return Promise.resolve(userExist);
    }

    function createGroup(props) {
        const id = uuidv4();
        const group = {...props, id};
        db.groups.push(group);
        return Promise.resolve(group);
    }

    function getAllGroups() {
        let groups = db.groups.map((group) => {
            group.accounts = hasManyAccount(group);
            return group;
        })
        return Promise.resolve(groups);
    }

    function getAllAccounts() {
        let accounts = db.accounts.map((account) => {
            account.groups = hasManyGroups(account);
            return account;
        })
        return Promise.resolve(accounts);
    }

    function joinGroup(obj) {
        const member = {id: uuidv4(), account_id: obj.account_id, group_id: obj.group_id};
        let checkIfExist = db.account_group.find(({account_id, group_id}) => {
            return account_id === obj.account_id && group_id === obj.group_id;
        })
        if (!checkIfExist) {
            member.account = account(member);
            member.group = group(member);
            db.account_group.push(_.cloneDeep(member));

            return Promise.resolve(member);
        }
        return Promise.resolve(checkIfExist);

    }

    function hasManyGroups(account) {
        let groups = db.account_group.filter(acc_grp => acc_grp.account_id === account.id);
        let r_groups = _.cloneDeep(groups);
        r_groups.forEach(group => {
            delete group.account;
            delete group.account_id;
        })
        return r_groups;
    }

    function hasManyAccount(group) {
        let accounts = db.account_group.filter(acc_grp => acc_grp.group_id === group.id);
        let r_accounts = _.cloneDeep(accounts);
        r_accounts.forEach(account => {

            delete account.group;
            delete account.group_id;
            delete (account.account || {}).online_status;
        })
        return r_accounts;
    }

    function account(group_account) {
        let account = db.accounts.find(account => account.id === group_account.account_id);
        if (account) {
            return account;
        }
        return '';
    }

    function group(group_account) {
        let getGroup = db.groups.find(group => group.id === group_account.group_id);
        if (getGroup) {
            return getGroup;
        }
        return '';
    }

    function getMessagesByGroup(groupId) {
        const groupMessages = db.messages.filter((m) => m.groupId === groupId);
        return Promise.resolve(groupMessages);
    }

    function addNewMessage(obj) {
        const message = {
            id: uuidv4(),
            message: obj.message,
            groupId: obj.groupId,
            accountId: obj.accountId,
            account: account({account_id: obj.accountId}),
            readBy: [],
        };
        db.messages.push(message);
        return Promise.resolve(message);
    }

    function getByGroupId(groupId) {
        const group = db.groups.find((g) => g.id === groupId);
        return Promise.resolve(group);
    }

    function getAccountByAccountId(accountId) {
        const account = db.accounts.find((a) => a.id === accountId);
        return Promise.resolve(account);
    }

    function updateAccountOnlineStatus(accountId, status) {
        const account = db.accounts.find((a) => a.id === accountId);
        let indexOfAccount = db.accounts.indexOf(account);
        if (indexOfAccount !== -1) {
            db.accounts[indexOfAccount].online_status = status;
        }
        return Promise.resolve(account);
    }

    function readMessage(accountId,groupId) {
        const message = db.messages.filter((m) => m.groupId === groupId);
        if (message.length > 0) {
            message.forEach((m) => {
                if(m.readBy.indexOf(accountId) === -1){
                    m.readBy.push(accountId);
                }
            });
        }
        return Promise.resolve(message);
    }

    return {
        createAccount,
        createGroup,
        getMessagesByGroup,
        joinGroup,
        getAllGroups,
        getAllAccounts,
        addNewMessage,
        getByGroupId,
        getAccountByAccountId,
        updateAccountOnlineStatus,
        readMessage,

    };
}

export default singleton(Db);
