(function () {
    // const name = prompt('What is your name?')
    const d = document,
        w = window,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd : db;


    w.CHAT = {
        msgObj: d.getElementById("message"),
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        selected_group: null,
        socket: null,
        //Keep the browser scroll bar at the bottom
        scrollToBottom: function () {
            w.scrollTo(0, this.msgObj.clientHeight);
        },
        //Exit, this example is just a simple refresh
        logout: function () {
            //this.socket.disconnect();
            location.reload();
        },
        //Submit chat message content
        submit: function () {
            const content = d.getElementById("content").value;
            if (content != '') {
                const obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content,
                    group: this.selected_group
                };
                this.socket.emit('message', obj);
                d.getElementById("content").value = '';
            }
            return false;
        },
        //Update the system message, in this case, it is called when the user joins or quits
        updateSysMsg: function (o, action) {
            //List of current online users
            const onlineUsers = o.onlineUsers;
            //Number of people currently online
            const onlineCount = o.onlineCount;
            //Information for newly added users
            const user = o.user;

            //Update online count
            let userhtml = '';
            let separator = '';
            for (key in onlineUsers) {
                if (onlineUsers.hasOwnProperty(key)) {
                    userhtml += separator + onlineUsers[key];
                    separator = ',';
                }
            }
            d.getElementById("onlinecount").innerHTML = 'Currently there are ' + onlineCount + ' people online, online list: ' + userhtml;

            //Add system messages
            let html = '';
            html += '<div class="msg-system">';
            html += user.username;
            html += (action == 'login') ? ' joined the chat room' : 'Exited the chat room';
            html += (action == 'typing') ? ' is typing' : '';
            html += '</div>';
            const section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
            this.scrollToBottom();
        },
        //The first interface user submits the username
        usernameSubmit: function () {
            const username = d.getElementById("username").value;
            if (username != "") {
                d.getElementById("username").value = '';
                d.getElementById("loginbox").style.display = 'none';
                d.getElementById("chatbox").style.display = 'block';
                // d.getElementById("group-list").style.display = 'block';
                var me=this;
                $.post('http://localhost:9000/api/account',{
                    name:username
                },function(result){
                    me.getGroupList();
                    me.init(result);
                    console.log(result)

                });
            }
            return false;
        },
        getGroupList:function(){
            var me=this;
            $.get('http://localhost:9000/api/groups',function(result){
                console.log(result)
                result.forEach((e)=>{
                    var li=d.createElement('li');
                    li.innerHTML=e.name;
                    li.setAttribute('data-id',e.id);
                    li.setAttribute('class','list-group-item');
                    li.onclick=function(){
                        $('.user').remove();
                        $('.service').remove();
                        me.socket.emit('group-join', {account_id:me.userid,group_id:e.id});
                        me.getGroupMsg(e);
                    }
                    d.getElementById('list').appendChild(li);
                });
                if (result.length>0){
                    me.getGroupMsg(result[0]);
                }

            });
        },
        getGroupMsg:function(grp_obj) {
            this.selected_group=grp_obj;
            var me=this;
            $.get('http://localhost:9000/api/chat/' + grp_obj.id, function (result) {
                console.log(result)
                // d.getElementById('list').innerHTML = '';
                result.forEach((obj) => {
                    //Add system messages
                    const isme = (obj.accountId == CHAT.userid);
                    const contentDiv = '<div>' + obj.message + '</div>';
                    const usernameDiv = '<span>' + (obj.account ||{}).name + '</span>';

                    const section = d.createElement('section');
                    if (isme) {
                        section.className = 'user';
                        section.innerHTML = contentDiv + usernameDiv;
                    } else {
                        section.className = 'service';
                        section.innerHTML = usernameDiv + contentDiv;
                    }
                    CHAT.msgObj.appendChild(section);
                    CHAT.scrollToBottom();
                })
            })
        },
        init: function (user_details) {
            /*
            The client generates the uid based on the time and a random number, so that the chat room user name can be repeated.
            In the actual project, if the user is required to log in, then the user's uid can be used as the identification directly.
            */
            this.userid = user_details.id;
            this.username = user_details.name;

            d.getElementById("showusername").innerHTML = this.username;
            //this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
            this.scrollToBottom();



            //Connect to the websocket backend server
            this.socket = io.connect('http://localhost:9000');

            // Tell the server that a user is logged in
            this.socket.emit('login', {userid: this.userid, username: this.username});
            var self = this;
            var timer;
            d.getElementById("content").onkeyup = function (e) {
                self.socket.emit('user-typing', user_details.name);

                // Clear timer
                clearTimeout(timer);

                // Wait for X ms and then process the request
                timer = setTimeout(() => {
                    self.socket.emit('typing-abort', user_details.name);
                }, 500);

            };

            // d.getElementById("content").onkeydown = function (e) {
            //     self.socket.emit('typing-abort', username);
            // };

            //Listen for new user login
            this.socket.on('login', function (o) {
                CHAT.updateSysMsg(o, 'login');
            });

            //listen to user exit
            this.socket.on('logout', function (o) {
                CHAT.updateSysMsg(o, 'logout');
            });

            //listen for message sending
            var me = this;
            this.socket.on('message', function (obj) {
                if (me.selected_group.id==obj.group.id) {
                const isme = (obj.userid == CHAT.userid) ? true : false;
                const contentDiv = '<div>' + obj.content + '</div>';
                const usernameDiv = '<span>' + obj.username + '</span>';

                const section = d.createElement('section');
                if (isme) {
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgObj.appendChild(section);
                CHAT.scrollToBottom();
                }

            });

            //listen for user typing
            this.socket.on('typing', function (user) {
                d.getElementById('user-typing').innerHTML = user + ' is typing...';
            });

            this.socket.on('typing-abort', function () {
                d.getElementById('user-typing').innerHTML ='';
            });

        }
    };
    //Submit username by "Enter"
    d.getElementById("username").onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.usernameSubmit();
        }
    };
    //Submit information by "Enter"
    d.getElementById("content").onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    };


})();