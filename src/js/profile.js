const leftBtn = document.getElementById('goLeft');
const rightBtn = document.getElementById('goRight');
const profilePicture = document.getElementById('profile-picture');
const bio = document.getElementById('bio');
const fullname = document.getElementById('fullname');
const interested = document.getElementById('accept');
const reject = document.getElementById('reject');

let users = [];

const params = new URLSearchParams(window.location.search);
const user = params.get('user');

if (user === null) {
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
else {
    let matchResponse = await fetch(`api/user/data?user=${user}`);
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
    rightBtn.hidden = user !== null && users.length > 1;
}

leftBtn.addEventListener('click', function (e) {
    if (currProfile > 0) {
        currProfile--;
        fillValues(users[currProfile]);
    }
    if (currProfile === 0) {
        leftBtn.hidden = true;
    }
    if (currProfile < users.length - 1) {
        rightBtn.hidden = false;
    }
});

rightBtn.addEventListener('click', function (e) {
    if (currProfile < users.length - 1) {
        currProfile++;
        fillValues(users[currProfile]);
    }
    if (currProfile === users.length - 1) {
        rightBtn.hidden = true;
    }
    if (currProfile > 0) {
        leftBtn.hidden = false;
    }
});

interested.addEventListener('click', async function (e) {
    let response = await fetch("/api/matches/acceptMatch", { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user2: users[currProfile].user }) });
    if (response.ok) {
        if (users.length > 1) {
            fillValues(users[(currProfile + 1) % users.length]);
            users.splice(currProfile, 1);
        }
        else {
            outOfProfiles();
            users.splice(currProfile, 1);
        }
    }
    if (currProfile === 0) {
        leftBtn.hidden = true;
    }
    if (currProfile < users.length - 1) {
        rightBtn.hidden = false;
    }
    if (currProfile === users.length - 1) {
        rightBtn.hidden = true;
    }
    if (currProfile > 0) {
        leftBtn.hidden = false;
    }
});

reject.addEventListener('click', async function (e) {
    if (users.length > 1) {
        fillValues(users[(currProfile + 1) % users.length]);
        users.splice(currProfile, 1);
    }
    else {
        outOfProfiles();
        users.splice(currProfile, 1);
    }
    if (currProfile === 0) {
        leftBtn.hidden = true;
    }
    if (currProfile < users.length - 1) {
        rightBtn.hidden = false;
    }
    if (currProfile === users.length - 1) {
        rightBtn.hidden = true;
    }
    if (currProfile > 0) {
        leftBtn.hidden = false;
    }
});

function fillValues(user) {
    if (user.profile != undefined && user.profile.profilejson != undefined) {
        let data = JSON.parse(user.profile.profilejson);
        bio.innerText = data.bio;
        profilePicture.src = data.profilePicture;
        fullname.innerText = data.userName;
    }
}

function outOfProfiles() {
    bio.innerText = "Lorem ipsum dolor sit amet, error fabellas interesset at pri, id nam detraxit constituam. In vim eius ridens consequuntur, eam ipsum epicurei eu. Facer veniam consul sea ea. At atomorum efficiendi signiferumque pri, ne dolorem erroribus salutatus quo, ad possit quodsi mea. Ea corrumpit intellegebat mei. Idque definiebas inciderint ad est, vix ut brute docendi.";
    profilePicture.src = "https://downtownseattle.org/app/uploads/2017/04/thumbnail_Placeholder-person.png";
    fullname.innerText = "No More Potential Matches At This Time";

}
