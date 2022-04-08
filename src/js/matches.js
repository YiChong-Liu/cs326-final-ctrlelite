const matchDIV = document.getElementById('matchList');

function newMatch(user_data){
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
    profilePicture.src = user_data.profile.profilePicture;
    profilePictureDIV.appendChild(profilePicture);

    let profileLinkDiv = document.createElement('div');
    profileLinkDiv.classList.add('col-md-3');
    contentDiv.appendChild(profileLinkDiv);
    let profileLink = document.createElement('a');
    profileLink.classList.add('link-primary');
    profileLink.innerHTML = `<h2>${user_data.profile.name}</h2>`;
    profileLink.href = "profile.html?userID=" + user_data.user_ID;
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
    buttonDIV.appendChild(chatButton);
    let removeButton = document.createElement('a');
    removeButton.classList.add("btn", "btn-primary", "btn-danger", "mb-3")
    removeButton.innerHTML = "Unmatch";
    buttonDIV.appendChild(removeButton);

    matchDIV.appendChild(wrapper);
}

let response = await fetch("http://localhost:3000/matches");
if(response.worked){
    responseJSON = await response.json();   
    console.log(responseJSON);
}