import { parseJwt } from "./main.js";

function makeNewMessage(msg, time, isTo) {
    if(isTo) {
        let message = document.createElement('div');

        let msg_body = document.createElement('div');
        msg_body.classList.add('card');
        msg_body.classList.add('text-black');
        msg_body.classList.add('bg-white');
        msg_body.classList.add('p-4');
        msg_body.classList.add('ms-auto');
        msg_body.classList.add('me-0');
        msg_body.classList.add('chat-msg');
        msg_body.textContent = msg;
        message.appendChild(msg_body);

        let time_stamp = document.createElement('p');
        time_stamp.classList.add('text-end');
        time_stamp.textContent = time;
        message.appendChild(time_stamp);

        return message;
    } else {
        let message = document.createElement('div');

        let msg_body = document.createElement('div');
        msg_body.classList.add('card');
        msg_body.classList.add('text-white');
        msg_body.classList.add('bg-primary');
        msg_body.classList.add('p-4');
        msg_body.classList.add('ms-0');
        msg_body.classList.add('me-auto');
        msg_body.classList.add('chat-msg');
        msg_body.textContent = msg;
        message.appendChild(msg_body);

        let time_stamp = document.createElement('p');
        time_stamp.classList.add('text-start');
        time_stamp.textContent = time;
        message.appendChild(time_stamp);

        return message;
    }
}

const params = new URLSearchParams(window.location.search);

if(params.has('userID2')) {
    // Gather user names and other important data
    const user1 = parseJwt(document.cookie).user;
    const user2 = params.get('userID2');
    const msgCount = 10;
    let msgData;
    let chatBody = document.getElementById('chat_body');

    // Gather messages
    let response = await fetch('/api/msg/fetch?userFrom=' + user1 + '&userTo=' + user2 + '&msgAmt=' + msgCount);
    if(response.ok){
        let msgJSON = await response.json();
        msgData = msgJSON.msg_object;
    } else {
        console.log('ERROR: failed to update preferences');
    }

    // Set chat header
    document.getElementById('chat_header').innerHTML = 'Chat - ' + user2;

    // Fill in the fake messages
    for(let i = 0; i < msgCount; i++) {
        chatBody.appendChild(makeNewMessage(msgData.fromMsgs[i], '10:42pm', false));
        chatBody.appendChild(makeNewMessage(msgData.toMsgs[i], '10:42pm', true));
    }
}
