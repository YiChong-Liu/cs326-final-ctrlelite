const leftBtn = document.getElementById('goLeft');
const rightBtn = document.getElementById('goRight');
const profilePicture = document.getElementById('profile-picture');
const bio = document.getElementById('bio');
const fullname = document.getElementById('fullname');

let users = [];

let response = await fetch("/api/matches/potentialMatches");
if (response.ok) {
    let responseJSON = await response.json();
    for (const match of responseJSON.potential_matches) {
        console.log(match);
        let matchResponse = await fetch(`api/user/data?user=${match}`);
        if (matchResponse.ok) {
            let matchJSON = await matchResponse.json();
            users.push(matchJSON.user_data);
        }
    }
    initProfile();
}

let currProfile = 0;

function initProfile() {
    if (users.length > 0) {
        fillValues(users[0]);
    }
}

leftBtn.addEventListener('click', function (e) {
    if (currProfile > 0) {
        currProfile--;
        fillValues(users[currProfile]);
    }
});

rightBtn.addEventListener('click', function (e) {
    if (currProfile < users.length - 1) {
        currProfile++;
        fillValues(users[currProfile]);
    }
});

function fillValues(user) {
    let data = JSON.parse(user.profile.profilejson);
    bio.innerText = data.bio;
    profilePicture.src = data.profilePicture;
    nameField.innerText = data.userName;
}
