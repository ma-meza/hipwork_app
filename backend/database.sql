CREATE DATABASE hipwork_app;

create table User(
    user_id int not null auto_increment primary key,
    full_name varchar(255) not null,
    address varchar(255),
    profile_picture varchar(255),
    agreements_acceptation_timestamp timestamp default GETDATE(),
    phone_number bigint unique
);

create table Payment(
    payment_id int not null auto_increment primary key,
    timestamp timestamp default GETDATE(),
    amount int,
    user_id int REFERENCES User(user_id)
);

create table Availability(
    availability_id int not null auto_increment primary key,
    start_datetime datetime,
    end_datetime datetime,
    user_id REFERENCES User(user_id)
);

create table Job_type(
    name varchar(50) not null primary key
);

create table Interest(
    job_type varchar(50) REFERENCES Job_type(name),
    user_id int REFERENCES User(user_id),
    PRIMARY KEY (job_type, user_id) 
);

create table Shift(
    shift_id int not null auto_increment primary key,
    start_datetime datetime,
    end_datetime datetime,
    instructions text,
    address varchar(255),
    salary int default 0,
    details text,
    job_type varchar(50) REFERENCES Job_type(name)
);

create table Shift_dispatch(
    id int not null auto_increment primary key,
    shift_id int REFERENCES Shift(shift_id),
    user_id int REFERENCES User(user_id),
    timestamp timestamp default GETDATE(),
    company_id int REFERENCES Company(company_id),
    status int default 0 --
);

create table Chat(
    chat_id int not null auto_increment primary key,
    user_id int REFERENCES User(user_id),
    company_id int REFERENCES Company(company_id),
    message text not null,
    shift_id int REFERENCES Shift(shift_id)
);

create table Message(
    message_id int not null auto_increment primary key,
    text text,
    timestamp bigint not null,
    chat_id int REFERENCES Chat(chat_id),
    user_id int REFERENCES User(user_id),
    company_id int REFERENCES Company(company_id)
);




create table Company(
    company_id int not null auto_increment primary key,
    name varchar(50)
);


create table Sms_verification(
    id int not null auto_increment primary key,
    phone bigint not null,
    timestamp bigint not null default,
    type varchar(20) not null,
    code int not null,
    FOREIGN KEY (phone) REFERENCES User(phone)
);










--populating data

INSERT INTO User(name, phone) VALUES ('mark31', 5149966247),('johndoe', 5149922837),('sarah21', 5148822938);

INSERT INTO Squad(name) VALUES ('mark31, johndoe'),('mark31, sarah31');

INSERT INTO Group_membership(group_id, user_id) VALUES (1, 1), (1,2), (2,1), (2,3);

INSERT INTO Challenge_type VALUES ("Send a selfie of with a finger mustach"),("Send a selfie with a crazy hat"),("Send a selfie with you upside down"),("Send a selfie with a spoon");

INSERT INTO Challenge(start_timestamp, group_id, challenge_type_id) VALUES ('2021-07-30 03:00:00', 1,1), ('2021-07-30 03:00:00',2,1), ('2021-07-31 03:00:00', 1,3), ('2021-07-31 03:00:00', 2,2);

INSERT INTO Sms_verification(phone, type, code) VALUES (5149966247, '2021-07-30 01:32:00', 212384);