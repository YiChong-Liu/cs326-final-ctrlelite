import { parseJwt } from "./main.js";

const profilePicture = document.getElementById('profile-picture');
const uploadImg = document.getElementById('img-upload');
const saveProfile = document.getElementById('save-profile');
const bio = document.getElementById('bio');
const nameField = document.getElementById('fullname');

let img;
uploadImg.addEventListener("change", (e) => {
    console.log("changed");
    let reader = new FileReader();
    reader.onload = function () {
        let output = profilePicture;
        output.src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0]);
    img = e.target.files[0];
});

saveProfile.addEventListener("click", async(e) => {
    let userID = parseJwt(document.cookie).user;
    let response = await fetch('/api/update/userProfile', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'uID': userID, 'profile': {userName: nameField.value, bio: bio.value, profilePicture: profilePicture.src}})});
    if(response.ok){
        let responseJSON = await response.json();
        if(responseJSON.worked){
            alert('Updated Profile');
        }
    }
});

window.onload = async () =>{
    let userID = parseJwt(document.cookie).user;
    let response = await fetch(`/api/user/data?user=${userID}`);
    if(response.ok){
        let responseJSON = await response.json();
        if(responseJSON.worked && responseJSON.user_data.profile != undefined && responseJSON.user_data.profile.profilejson != undefined){
            let data = JSON.parse(responseJSON.user_data.profile.profilejson);
            bio.innerText = data.bio;
            profilePicture.src = data.profilePicture;
            nameField.innerText = data.userName;
        }
    }
}