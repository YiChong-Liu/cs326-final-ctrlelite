const leftBtn = document.getElementById('goLeft');
const rightBtn = document.getElementById('goRight');
const profilePicture = document.getElementById('profile-picture');
const bio = document.getElementById('bio');
const fullname = document.getElementById('fullname');
const interested = document.getElementById('accept');

let users = [];

const user = params.get('user');

if(user === undefined){
    let response = await fetch("/api/matches/potentialMatches");
    if (response.ok) {
        let responseJSON = await response.json();
        for (const match of responseJSON.potential_matches) {
            let matchResponse = await fetch(`api/user/data?user=${match.uid}`);
            if (matchResponse.ok) {
                let matchJSON = await matchResponse.json();
                users.push(matchJSON.user_data);
            }
        }
        initProfile();
    }
}
else{
    let matchResponse = await fetch(`api/user/data?user=${user2}`);
    if (matchResponse.ok) {
        let matchJSON = await matchResponse.json();
        users.push(matchJSON.user_data);
    }
    initProfile();
}



let currProfile = 0;

function initProfile() {
    if (users.length > 0) {
        fillValues(users[0]);
    }
    leftBtn.hidden = true;
    rightBtn.hidden = users.length > 1;
}

leftBtn.addEventListener('click', function (e) {
    if (currProfile > 0) {
        currProfile--;
        fillValues(users[currProfile]);
    }
    if(currProfile === 0){
        leftBtn.hidden = true;
    }
    if(currProfile < users.length - 1){
        rightBtn.hidden = false;
    }
});

rightBtn.addEventListener('click', function (e) {
    if (currProfile < users.length - 1) {
        currProfile++;
        fillValues(users[currProfile]);
    }
    if(currProfile === users.length - 1){
        rightBtn.hidden = true;
    }
    if(currProfile > 0){
        leftBtn.hidden = false;
    }
});

interested.addEventListener('click', async function (e) {
    let response = await fetch("/api/matches/acceptMatch", {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user2: users[currProfile].user})});
    if(response.ok){
        if(users.length > 0){
            fillValues(users[(currProfile + 1) % users.length]);
            users.splice(currProfile, 1);
        }
    }
    if(currProfile === 0){
        leftBtn.hidden = true;
    }
    if(currProfile < users.length - 1){
        rightBtn.hidden = false;
    }
    if(currProfile === users.length - 1){
        rightBtn.hidden = true;
    }
    if(currProfile > 0){
        leftBtn.hidden = false;
    }
});

function fillValues(user) {
    if(user.profile != undefined && user.profile.profilejson != undefined){
        let data = JSON.parse(user.profile.profilejson);
        bio.innerText = data.bio;
        profilePicture.src = data.profilePicture;
        fullname.innerText = data.userName;
    }
}
