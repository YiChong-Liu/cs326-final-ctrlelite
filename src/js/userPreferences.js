//----------------//
// Document Nodes //
//----------------//

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

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

    let g, a, h, s, c, sh;

    if(male_genderRadio.checked) { g = 'male'; }
    if(female_genderRadio.checked) { g = 'female'; }
    if(nonbinary_genderRadio.checked) { g = 'non-binary'; }
    if(any_genderRadio.checked) { g = 'any-gender'; }
    let genderImportance = genderImportanceBar.value;

    if(teen_ageRadio.checked) { a = 'teenage'; }
    if(middle_ageRadio.checked) { a = 'middle-age'; }
    if(senior_ageRadio.checked) { a = 'senior'; }
    if(elderly_ageRadio.checked) { a = 'elderly'; }
    if(any_ageRadio.checked) { a = 'any-age'; }
    let ageImportance = ageImportanceBar.value;

    if(apartment_housingRadio.checked) { h = 'apartment'; }
    if(townhouse_housingRadio.checked) { h = 'townhouse'; }
    if(condo_housingRadio.checked) { h = 'condo'; }
    let housingImportance = housingImportanceBar.value;

    if(noNoise_sleepRadio.checked) { s = 'no-noise'; }
    if(aLittleNoise_sleepRadio.checked) { s = 'a-little-noise'; }
    if(aLotOfNoise_sleepRadio.checked) { s = 'a-lot-of-noise'; }
    let sleepImportance = sleepImportanceBar.value;

    if(very_cleanRadio.checked) { c = 'no-noise'; }
    if(somewhat_cleanRadio.checked) { c = 'a-little-noise'; }
    if(not_cleanRadio.checked) { c = 'a-lot-of-noise'; }
    let cleanImportance = cleanImportanceBar.value;

    if(everything_shareRadio.checked) { sh = 'everything'; }
    if(some_shareRadio.checked) { sh = 'some'; }
    if(none_shareRadio.checked) { sh = 'nothing'; }
    let shareImportance = shareImportanceBar.value;

    let userPreferences = {
        gender: g, gender_importance: genderImportance,
        age: a, age_importance: ageImportance,
        housing: h, housing_importance: housingImportance,
        sleep: s, sleep_importance: sleepImportance,
        clean: c, clean_importance: cleanImportance,
        share: sh, share_importance: shareImportance
    };

    let user = parseJwt(document.cookie).user;

    let response = await fetch('/api/update/userPreferences', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'userID': user, 'preferences': userPreferences})});
    if(response.ok){
        let matchJSON = await response.json();
        console.log(matchJSON);
    } else {
        console.log('ERROR: failed to update preferences');
    }
});
