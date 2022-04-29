//----------------//
// Document Nodes //
//----------------//

import { parseJwt } from "./main.js";

let userID = parseJwt(document.cookie).user;

// Gender
let male_genderRadio = document.getElementById('gender_male');
let female_genderRadio = document.getElementById('gender_female');
let nonbinary_genderRadio = document.getElementById('gender_nonbinary');
let any_genderRadio = document.getElementById('gender_any');
let genderImportanceBar = document.getElementById('gender_rangeBar');

// Age
let teen_ageRadio = document.getElementById('age_teen');
let middle_ageRadio = document.getElementById('age_middle');
let senior_ageRadio = document.getElementById('age_senior');
let elderly_ageRadio = document.getElementById('age_elderly');
let any_ageRadio = document.getElementById('age_any');
let ageImportanceBar = document.getElementById('age_rangeBar');

// Housing
let apartment_housingRadio = document.getElementById('house_apartment');
let townhouse_housingRadio = document.getElementById('house_townhouse');
let condo_housingRadio = document.getElementById('house_condo');
let housingImportanceBar = document.getElementById('house_rangeBar');

// Sleep
let noNoise_sleepRadio = document.getElementById('sleep_noNoise');
let aLittleNoise_sleepRadio = document.getElementById('sleep_aLittleNoise');
let aLotOfNoise_sleepRadio = document.getElementById('sleep_aLotOfNoise');
let sleepImportanceBar = document.getElementById('sleep_rangeBar');

// Cleanliness
let very_cleanRadio = document.getElementById('clean_very');
let somewhat_cleanRadio = document.getElementById('clean_somewhat');
let not_cleanRadio = document.getElementById('clean_not');
let cleanImportanceBar = document.getElementById('clean_rangeBar');

// Sharing
let everything_shareRadio = document.getElementById('share_everything');
let some_shareRadio = document.getElementById('share_some');
let none_shareRadio = document.getElementById('share_none');
let shareImportanceBar = document.getElementById('share_rangeBar');

// Event Listener for the Submit Button
document.getElementById('preferencesSubmit').addEventListener('click', async function(x) {
    // Declare preference variables
    let g, a, h, s, c, sh;

    // Gender Preferences
    if(male_genderRadio.checked) { g = 'male'; }
    if(female_genderRadio.checked) { g = 'female'; }
    if(nonbinary_genderRadio.checked) { g = 'non-binary'; }
    if(any_genderRadio.checked) { g = 'any-gender'; }
    let genderImportance = genderImportanceBar.value;

    // Age Preferences
    if(teen_ageRadio.checked) { a = 'teenage'; }
    if(middle_ageRadio.checked) { a = 'middle-age'; }
    if(senior_ageRadio.checked) { a = 'senior'; }
    if(elderly_ageRadio.checked) { a = 'elderly'; }
    if(any_ageRadio.checked) { a = 'any-age'; }
    let ageImportance = ageImportanceBar.value;

    // Housing Preferences
    if(apartment_housingRadio.checked) { h = 'apartment'; }
    if(townhouse_housingRadio.checked) { h = 'townhouse'; }
    if(condo_housingRadio.checked) { h = 'condo'; }
    let housingImportance = housingImportanceBar.value;

    // Sleeping noise Preferences
    if(noNoise_sleepRadio.checked) { s = 'no-noise'; }
    if(aLittleNoise_sleepRadio.checked) { s = 'a-little-noise'; }
    if(aLotOfNoise_sleepRadio.checked) { s = 'a-lot-of-noise'; }
    let sleepImportance = sleepImportanceBar.value;

    // Cleanliness Preferences
    if(very_cleanRadio.checked) { c = 'very_clean'; }
    if(somewhat_cleanRadio.checked) { c = 'somewhat_clean'; }
    if(not_cleanRadio.checked) { c = 'not_clean'; }
    let cleanImportance = cleanImportanceBar.value;

    // Sharing Preferences
    if(everything_shareRadio.checked) { sh = 'everything'; }
    if(some_shareRadio.checked) { sh = 'some'; }
    if(none_shareRadio.checked) { sh = 'nothing'; }
    let shareImportance = shareImportanceBar.value;

    // Create the preferences object
    let userPreferences = {
        gender: g, genderImportance: genderImportance,
        age: a, ageImportance: ageImportance,
        housingType: h, housingTypeImportance: housingImportance,
        noiseLevel: s, noiseImportance: sleepImportance,
        cleanliness: c, cleanlinessImportance: cleanImportance,
        sharing: sh, sharingImportance: shareImportance
    };

    let user = parseJwt(document.cookie).user;

    let response = await fetch('/api/update/userPreferences', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'userID': user, 'preferences': userPreferences})});
    if(response.ok){
        let responseJSON = await response.json();
        console.log(responseJSON);
        alert('Preferences Saved!');
    } else {
        console.log('ERROR: failed to update preferences');
    }
});

async function loadPreviousData() {
    userID = userID;
    let response = await fetch(`api/user/data?user=${userID}`);
    let prefObj = null;
    if(response.ok) {
        let responseJSON = await response.json();
        prefObj = responseJSON.user_data.preferences;
    }

    if(prefObj === undefined) { return; }

    // Gender
    switch(prefObj.gender) {
        case 'male': male_genderRadio.checked = true; break;
        case 'female': female_genderRadio.checked = true; break;
        case 'non-binary': nonbinary_genderRadio.checked = true; break;
        case 'any-gender': any_genderRadio.checked = true; break;
        default: break;
    }
    genderImportanceBar.value = parseInt(prefObj.genderimportance);

    // Age
    switch(prefObj.age) {
        case 'teenage': teen_ageRadio.checked = true; break;
        case 'middle-age': middle_ageRadio.checked = true; break;
        case 'senior': senior_ageRadio.checked = true; break;
        case 'elderly': elderly_ageRadio.checked = true; break;
        case 'any-age': any_ageRadio.checked = true; break;
        default: break;
    }
    ageImportanceBar.value = parseInt(prefObj.ageimportance);

    // Housing
    switch(prefObj.housingtype) {
        case 'apartment': apartment_housingRadio.checked = true; break;
        case 'townhouse': townhouse_housingRadio.checked = true; break;
        case 'condo': condo_housingRadio.checked = true; break;
        default: break;
    }
    housingImportanceBar.value = parseInt(prefObj.housingtypeimportance);

    // Noise
    switch(prefObj.noiselevel) {
        case 'no-noise': noNoise_sleepRadio.checked = true; break;
        case 'a-little-noise': aLittleNoise_sleepRadio.checked = true; break;
        case 'a-lot-of-noise': aLotOfNoise_sleepRadio.checked = true; break;
        default: break;
    }
    sleepImportanceBar.value = parseInt(prefObj.noiseimportance);

    // Clean
    switch(prefObj.cleanliness) {
        case 'very_clean': very_cleanRadio.checked = true; break;
        case 'somewhat_clean': somewhat_cleanRadio.checked = true; break;
        case 'not_clean': not_cleanRadio.checked = true; break;
        default: break;
    }
    cleanImportanceBar.value = parseInt(prefObj.cleanlinessimportance);

    // Sharing
    switch(prefObj.sharing) {
        case 'everything': everything_shareRadio.checked = true; break;
        case 'some': some_shareRadio.checked = true; break;
        case 'nothing': none_shareRadio.checked = true; break;
        default: break;
    }
    shareImportanceBar.value = parseInt(prefObj.sharingimportance);
}

loadPreviousData();
