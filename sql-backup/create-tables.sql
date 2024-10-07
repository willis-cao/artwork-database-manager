CREATE TABLE Artist (
	artist_id 	INT AUTO_INCREMENT,
	birth_year 	INT,
	death_year 	INT,
	name 		VARCHAR(255) NOT NULL,
	PRIMARY KEY (artist_id)
);

CREATE TABLE Owner (
	owner_id	INT AUTO_INCREMENT,
	name 		VARCHAR(255) NOT NULL,
	PRIMARY KEY (owner_id)
);

CREATE TABLE Customer (
	customer_id	INT AUTO_INCREMENT,
	name		VARCHAR(255) NOT NULL,
	price_group	VARCHAR(255) NOT NULL,
	email		VARCHAR(255) NOT NULL,
	PRIMARY KEY (customer_id),
	CONSTRAINT Customer UNIQUE (email)
);

CREATE TABLE Gallery (
	gallery_id 	INT AUTO_INCREMENT,
	name 		VARCHAR(255) NOT NULL,
	PRIMARY KEY (gallery_id) 
);

CREATE TABLE Curator (
	curator_id	INT AUTO_INCREMENT,
	name		VARCHAR(255) NOT NULL,
	PRIMARY KEY (curator_id)
);

CREATE TABLE Exhibit (
	exhibit_id 	INT AUTO_INCREMENT,
	gallery_id 	INT,
	title 		VARCHAR(255),
	start_date 	DATE,
	end_date 	DATE,
	PRIMARY KEY (exhibit_id),
	FOREIGN KEY (gallery_id) REFERENCES Gallery (gallery_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Art (
	art_id 			INT AUTO_INCREMENT,
	owner_id 		INT NOT NULL,
	title 			VARCHAR(255),
    year_created 	INT,
    description 	VARCHAR(4000),
	exhibit_id 		INT,
	artist_id       INT NOT NULL,
	PRIMARY KEY (art_id),
	FOREIGN KEY (owner_id) REFERENCES Owner (owner_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (artist_id) REFERENCES Artist (artist_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (exhibit_id) REFERENCES Exhibit (exhibit_id)
);


CREATE TABLE Makes (
	art_id 		INT,
	artist_id 	INT,
	PRIMARY KEY (art_id, artist_id),
	FOREIGN KEY (art_id) REFERENCES Art (art_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (artist_id) REFERENCES Artist (artist_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Displays (
	art_id 		INT,
	gallery_id 	INT,
	PRIMARY KEY (art_id, gallery_id),
	FOREIGN KEY (art_id) REFERENCES Art (art_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (gallery_id) REFERENCES Gallery (gallery_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Digital (
	art_id 		INT,
	url 		VARCHAR(255),
	PRIMARY KEY (art_id),
	FOREIGN KEY (art_id) REFERENCES Art (art_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Sculpture (
	art_id 		INT,
	material 	VARCHAR(255),
	size 		VARCHAR(255),
	PRIMARY KEY (art_id),
	FOREIGN KEY (art_id) REFERENCES Art (art_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Painting (
	art_id 		INT,
	dimension 	VARCHAR(255),
	medium 		VARCHAR(255),
	PRIMARY KEY (art_id),
	FOREIGN KEY (art_id) REFERENCES Art (art_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Manages (
	curator_id		INT,
	gallery_id		INT,
	starting_date	DATE,
	PRIMARY KEY (curator_id, gallery_id),
	FOREIGN KEY (curator_id) REFERENCES Curator (curator_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (gallery_id) REFERENCES Gallery (gallery_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Oversees (
	curator_id 	INT,
    exhibit_id 	INT,
	PRIMARY KEY (curator_id, exhibit_id),
	FOREIGN KEY (curator_id) REFERENCES Curator (curator_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (exhibit_id) REFERENCES Exhibit (exhibit_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Art_Gallery (
	gallery_id 		INT,
	address 		VARCHAR(255),
	city 			VARCHAR(255),
	state_province 	VARCHAR(255),
	postal_code		VARCHAR(255), 
	country			VARCHAR(255),
	PRIMARY KEY (gallery_id),
	FOREIGN KEY (gallery_id ) REFERENCES Gallery (gallery_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Museum (
	gallery_id 	INT,
	address 		VARCHAR(255),
	city 			VARCHAR(255),
	state_province 	VARCHAR(255),
	postal_code		VARCHAR(255), 
	country			VARCHAR(255),
	PRIMARY KEY (gallery_id),
	FOREIGN KEY (gallery_id ) REFERENCES Gallery (gallery_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Virtual_Art_Gallery (
	gallery_id 	INT,
	url 		VARCHAR(255),
	PRIMARY KEY (gallery_id),
	FOREIGN KEY (gallery_id ) REFERENCES Gallery (gallery_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Transfers (
	art_id 		INT,
	origin		INT,
	date		DATE,
	destination	INT,	
	PRIMARY KEY (art_id, origin, destination),
	FOREIGN KEY(art_id) REFERENCES Art (art_id)
		ON UPDATE CASCADE,
	FOREIGN KEY(origin) REFERENCES Gallery(gallery_id),
    FOREIGN KEY(destination) REFERENCES Gallery(gallery_id)
);

CREATE TABLE CustomerVisitsExhibit (
	customer_id	INT,
	date		DATE,
	exhibit_id	INT,
	PRIMARY KEY (customer_id, date),
	FOREIGN KEY(customer_id) REFERENCES Customer(customer_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY(exhibit_id) REFERENCES Exhibit (exhibit_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE ExhibitCharges (
	exhibit_id	INT,
	price		INT,
	price_group	VARCHAR (255),
	PRIMARY KEY (exhibit_id, price),
	FOREIGN KEY (exhibit_id) REFERENCES Exhibit (exhibit_id)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);

CREATE TABLE Visits (
	customer_id	INT,
	exhibit_id	INT,
	date		DATE NOT NULL,
	price		INT,
	PRIMARY KEY (customer_id, exhibit_id),
	FOREIGN KEY (customer_id, date) REFERENCES CustomerVisitsExhibit (customer_id, date)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (exhibit_id, price) REFERENCES ExhibitCharges (exhibit_id, price)
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);
