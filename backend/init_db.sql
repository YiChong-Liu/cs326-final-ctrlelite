CREATE TABLE IF NOT EXISTS users(
    uID UUID NOT NULL,
    password varchar(450) NOT NULL,
    email varchar(50) NOT NULL,
    PRIMARY KEY(uID)
);

CREATE TABLE IF NOT EXISTS matches(
    uID1 UUID NOT NULL,
    uID2 UUID NOT NULL,
    u1Accept BIT DEFAULT '0',
    u2Accept BIT DEFAULT '0',
    PRIMARY KEY(uID1, uID2)
);

CREATE TABLE IF NOT EXISTS userPreferences(
    uID UUID NOT NULL,
    state varchar(40),
    city varchar(40),
    gender varchar(20), 
    genderImportance decimal,
    age integer,
    ageImportance decimal,
    housingType varchar(20),
    housingTypeImportance decimal, 
    noiseLevel varchar(30), 
    noiseImportance decimal,
    cleanliness varchar(40),
    cleanlinessImportance decimal,
    sharing varchar(40),
    sharingImportance decimal,
    PRIMARY KEY(uID)
);

CREATE TABLE IF NOT EXISTS userProfiles(
    uID UUID NOT NULL,
    profileJSON text,
    PRIMARY KEY(uID)
);

CREATE TABLE IF NOT EXISTS chat(
    uID1 UUID NOT NULL,
    uID2 UUID NOT NULL,
    msg text,
    PRIMARY KEY(uID1, uID2),
    time TIMESTAMP 
);

