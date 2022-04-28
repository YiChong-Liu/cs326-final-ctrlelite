const matchDIV = document.getElementById('matchList');

function newMatch(user_data){
    let profileData = JSON.parse(user_data.profile.profilejson);

    let wrapper  = document.createElement('li');
    wrapper.classList.add("list-group-item");
    let contentDiv = document.createElement('div');
    contentDiv.classList.add("row", "align-items-center");
    wrapper.appendChild(contentDiv);

    let profilePictureDIV = document.createElement('div');
    profilePictureDIV.classList.add('col-md-1');
    contentDiv.appendChild(profilePictureDIV);
    let profilePicture = document.createElement('img');
    profilePicture.classList.add('rounded-circle', 'w-100');
    profilePicture.src = profileData.profilePicture;
    profilePictureDIV.appendChild(profilePicture);

    let profileLinkDiv = document.createElement('div');
    profileLinkDiv.classList.add('col-md-3');
    contentDiv.appendChild(profileLinkDiv);
    let profileLink = document.createElement('a');
    profileLink.classList.add('link-primary');
    profileLink.innerHTML = `<h2>${profileData.userName}</h2>`;
    profileLink.href = "profile.html?userID=" + user_data.user;
    profileLinkDiv.appendChild(profileLink);

    let spacingDIV = document.createElement('div');
    spacingDIV.classList.add('col-md-6');
    contentDiv.appendChild(spacingDIV);

    let buttonDIV = document.createElement('div');
    buttonDIV.classList.add("col-md-2", "float-end");
    contentDiv.appendChild(buttonDIV);

    let chatButton = document.createElement('a');
    chatButton.classList.add("btn", "btn-primary", "btn-block", "mb-3");
    chatButton.innerHTML = "Chat";
    chatButton.href = `chat.html?userID2=${profileData.userName}`;
    buttonDIV.appendChild(chatButton);
    let removeButton = document.createElement('a');
    removeButton.classList.add("btn", "btn-primary", "btn-danger", "mb-3")
    removeButton.innerHTML = "Unmatch";
    removeButton.addEventListener('click', unmatch(user_data.user));
    buttonDIV.appendChild(removeButton);

    matchDIV.appendChild(wrapper);
}

let response = await fetch("/api/matches");
if(response.ok){
    let responseJSON = await response.json();  
    for(const match of responseJSON.user_matches){
        let matchResponse = await fetch(`api/user/data?user=${match.uid}`);
        if(matchResponse.ok){
            let matchJSON = await matchResponse.json();
            console.log(matchJSON);
            newMatch(matchJSON.user_data);
        }
    } 
    console.log(responseJSON);
}

async function unmatch(uID, element){
    let response = await fetch("/api/delete/match", {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user2: uID})});
    if(response.ok){
        document.removeChild(element);
    }
}