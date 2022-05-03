# CS326 Team 8: ctrlelite

## The Rentern

### Spring 2022

### Overview

Our project is to design and implement a corporate roommate finder — for example, if you are offered a new job and need to relocate, under such circumstances you are looking for new roommates to rent a house, you can sign up for our website by a valid email account and a password, specify the user preferences including housing location, housing type, age/gender preference, sleep schedule, cleanliness, and things to share, etc. And the website will provide recommended matches so they can send interests, chat and potentially become roommates. 

### Team Members

* Conlan Cesar	         ([@HeroCC](https://github.com/HeroCC))
* Benjamin Tufano           ([@tufanobenjamin](https://github.com/tufanobenjamin))
* Liam Neal Reilly             ([@lhnealreilly](https://github.com/lhnealreilly))
* Yichong Liu                     ([@YiChong_Liu](https://github.com/YiChong-Liu))

### Databases

#### 5 Tables:
- [Users](#users)
- [UserPreferences](#userpreferences)
- [UserProfiles](#userprofiles)
- [Matches](#matches)
- [Chat](#chat)


#### Users
|  Column  |          Type          | Description |
| --- | --- | --- |
 uid      | uuid                   | The user's unique ID.
 password | character varying(450) | The user's password stored as a hash.
 email    | character varying(50)  | The user's email address.

#### UserPreferences
|  Column  |          Type          | Description |
| --- | --- | --- |
 uid                   | uuid                  | The user's unique ID.
 state                 | character varying(40) | The user's state.
 city                  | character varying(40) | The user's city.
 gender                | character varying(20) | The user's gender.
 genderimportance      | numeric               | The user's importance level of a roommate sharing their gender.
 age                   | character varying(40) | The user's age range ('teenage', etc.)
 ageimportance         | numeric               | The user's importance level of a roommate sharing their age-range.
 housingtype           | character varying(20) | The user's preference of housing type.
 housingtypeimportance | numeric               | The user's importance level of a roommate sharing their housing type.
 noiselevel            | character varying(30) | The user's preferred noise level.
 noiseimportance       | numeric               | The user's importance level of a roommate sharing their noise level.
 cleanliness           | character varying(40) | The user's preferred cleanliness level.
 cleanlinessimportance | numeric               | The user's importance level of a roommate sharing their cleanliness.
 sharing               | character varying(40) | The user's stance on sharing.
 sharingimportance     | numeric               | The user's importance level of a roommate sharing their stance on sharing.

#### UserProfiles
|  Column  |          Type          | Description |
| --- | --- | --- |
 uid         | uuid | The user's unique ID.
 profilejson | text | The Stringified JSON of the user's profile information (bio, name, profilePicture)

#### Matches
|  Column  |          Type          | Description |
| --- | --- | --- |
 uid1     | uuid   | The unique ID of one of the users in the match.
 uid2     | uuid   | The unique ID of one of the users in the match.
 u1accept | bit(1) | Whether uid1 has accepted the match or not.
 u2accept | bit(1) | Whether uid2 has accepted the match or not.

#### Chat
|  Column  |          Type          | Description |
| --- | --- | --- |
 uid1   | uuid                        | The unique ID of the user that sent the message.
 uid2   | uuid                        | The unique ID of the user that received the message.
 msg    | text                        | The body text of the message.
 time   | timestamp without time zone | The timestamp of the message in UTC time.

<br>
<br>
<br>
<br>

 ## Division of Labor:

Conlan Cesar: Postgres Integration 
Benjamin Tufano: userPreferences DB integration 
Liam Neal Reilly: SQL querys, webSockets for Chat, profile.js DB integration, DB documentation
Yichong Liu: Roommate matching algorithm, database.js, footer, staff.html, social media, polish the front end