import * as utils from "main.js";

const profilePicture = document.getElementById('profile-picture');
const uploadImg = document.getElementById('img-upload');
const saveProfile = document.getElementById('save-profile');
const bio = document.getElementById('bio');
const nameField = document.getElementById('fullname');


uploadImg.addEventListener("change", (e) => {
    console.log("changed");
    let reader = new FileReader();
    reader.onload = function () {
        let output = profilePicture;
        output.src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

saveProfile.addEventListener("click", async(e) => {
    
    let response = await fetch('/api/update/userProfile', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'userID': "user", 'profile': {userName: nameField.value, bio: bio.value, profilePicture: profilePicture.src}})});
});
