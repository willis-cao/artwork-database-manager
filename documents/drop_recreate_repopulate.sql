DROP TABLE Visits;
DROP TABLE ExhibitCharges;
DROP TABLE CustomerVisitsExhibit ;
DROP TABLE Transfers ;
DROP TABLE Virtual_Art_Gallery ;
DROP TABLE Museum ;
DROP TABLE Art_Gallery ;
DROP TABLE Oversees ;
DROP TABLE Manages ;
DROP TABLE Painting ;
DROP TABLE Sculpture ;
DROP TABLE Digital ;

DROP TABLE Makes ;
DROP TABLE Art ;
DROP TABLE Exhibit ;
DROP TABLE Curator ;
DROP TABLE Gallery ;
DROP TABLE Customer ;
DROP TABLE Owner ;
DROP TABLE Artist ;


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

INSERT INTO Gallery (name) 
VALUES('Vancouver Art Gallery'); 

INSERT INTO Gallery (name)
VALUES('The British Museum'); 

INSERT INTO Gallery (name)
VALUES('Canadian Online Art Library'); 

INSERT INTO Gallery (name)
VALUES('Los Angeles County Museum of Art');

INSERT INTO Gallery (name)
VALUES('Free Digital Art Gallery');

INSERT INTO Gallery (name)
VALUES('National Museum of Modern and Contemporary Art'); 

INSERT INTO Gallery (name)
VALUES('China Art Museum'); 

INSERT INTO Gallery (name)
VALUES('SpaceArtCollection.com'); 

INSERT INTO Gallery (name)
VALUES('Bobs Gallery'); 

INSERT INTO Customer (name,price_group,email)
VALUES ('John Johnson', 'Adult', 'JohnJohnson@gmail.com');

INSERT INTO Customer (name,price_group,email)
VALUES ('Frank Sausage', 'Adult', 'SausageFrank@mail.com');

INSERT INTO Customer (name,price_group,email)
VALUES ('Sarah Kerrigan', 'Student', 'heartsoftheswarm@gmail.com');

INSERT INTO Customer (name,price_group,email)
VALUES ('Dekerd Cain', 'Senior', 'diablooldguy@gmail.com');

INSERT INTO Customer (name,price_group,email)
VALUES ('Dale Falconer', 'Adult', 'dalefalconer69@gmail.com');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(1881, 1973, 'Pablo Picasso');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(1452, 1519, 'Leonardo da Vinci');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(1871, 1945, 'Emily Carr');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(1946, NULL, 'Stephen Lack');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(1941, NULL, 'Charlie Inukpuk');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(2010, 2023, 'Jay');

INSERT INTO Artist (birth_year,death_year,name)
VALUES(1995, NULL, 'Sarah Smith');

INSERT INTO Curator(name)
VALUES('Joseph Joestar');

INSERT INTO Curator(name)
VALUES('Maruf Aristeides');

INSERT INTO Curator(name)
VALUES('Ventsislav Zakaria');

INSERT INTO Curator(name)
VALUES('Thorsten Sudhir');

INSERT INTO Curator(name)
VALUES('Roddy Włodzimierz');

INSERT INTO Owner (name) 
VALUES('British Museum');

INSERT INTO Owner (name) 
VALUES('Bob Richman');

INSERT INTO Owner (name) 
VALUES('Canadian Art Society');

INSERT INTO Owner (name) 
VALUES('Indigenous Art Gallery');

INSERT INTO Owner (name) 
VALUES('Vancouver Art Gallery');

INSERT INTO Art_Gallery (gallery_id, address, city, state_province, postal_code, country)
VALUES(1, '750 Hornby St', 'Vancouver', 'BC', 'V6Z 2H7', 'Canada');

INSERT INTO Museum (gallery_id, address, city, state_province, postal_code, country)
VALUES(2, 'Great Russell St', 'London', NULL, 'WC1B 3DG', 'The United Kingdom of Great Britain and Northern Ireland');

INSERT INTO Museum (gallery_id, address, city, state_province, postal_code, country)
VALUES(4, '5905 Wilshire Blvd', 'Los Angeles', 'CA', '90036', 'United States of America');

INSERT INTO Museum (gallery_id, address, city, state_province, postal_code, country)
VALUES(6, '30 Samcheong-ro 5-gil, Jongno-gu', 'Seoul', NULL, NULL, 'Republic of Korea');

INSERT INTO Museum (gallery_id, address, city, state_province, postal_code, country)
VALUES(7, '205 Shangnan Road', 'Shanghai', NULL, '200010', 'China');

INSERT INTO Virtual_Art_Gallery (gallery_id, url)
VALUES(3, 'COAL.com');

INSERT INTO Virtual_Art_Gallery (gallery_id, url)
VALUES(5, 'FreeDigitalArtGallery.com');

INSERT INTO Virtual_Art_Gallery (gallery_id, url)
VALUES(8, 'SpaceArtCollection.com');

INSERT INTO Virtual_Art_Gallery (gallery_id, url)
VALUES(9, 'BobsArtHaven.com');

INSERT INTO Exhibit (gallery_id, title, start_date, end_date)
VALUES(2, '2025 British Museum Back to the Past', '2025-04-01', '2025-04-06');

INSERT INTO Exhibit (gallery_id, title, start_date, end_date)
VALUES(1, '2026 Winter Picasso Special', '2026-11-25', '2026-12-25');

INSERT INTO Exhibit (gallery_id, title, start_date, end_date)
VALUES(6, 'Tradition meets VR', '2025-07-02', '2025-07-22');

INSERT INTO Exhibit (gallery_id, title, start_date, end_date)
VALUES(4, 'LA Spring Exhibit', '2027-03-01', '2027-04-30');

INSERT INTO Exhibit (gallery_id, title, start_date, end_date)
VALUES(7, 'Meet the Emperor Exhibit', '2026-06-01', '2026-09-01');

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(1, 'Guernica', 1937, 'The grey, black, and white painting, on a canvas 3.49 meters (11 ft 5 in) tall and 7.76 meters (25 ft 6 in) across, portrays the suffering wrought by violence and chaos. Prominent in the composition are a gored horse, a bull, screaming women, a dead baby, a dismembered soldier, and flames.', 2, 1);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(2, 'The Last Supper', 1498, 'The painting represents the scene of the Last Supper of Jesus with the Twelve Apostles, as it is told in the Gospel of John, specifically the moment after Jesus announces that one of his apostles will betray him. Its handling of space, mastery of perspective, treatment of motion and complex display of human emotion has made it one of the Western world''s most recognizable paintings and among Leonardo''s most celebrated works. Some commentators consider it pivotal in inaugurating the transition into what is now termed the High Renaissance.', 1, 2);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(3, 'The Indian Church', 1929, 'The Indian Church is considered a transitional painting because it reflects the transition of Carr''s artistic work from purely depicting Native Art to shifting her focus toward the land. In her 1946 autobiography, Growing Pains, Carr wrote that she felt the subject deeply. She painted it at Friendly Cove, near a lighthouse.', 1, 3);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(4, 'Burnt Kiss', NULL, NULL, NULL, 4);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(5, 'UNTITLED - CROUCHING HUNTER', NULL, 'Charlie Inukpuk told Louis Gagnon: When I first started carving, the main challenge was determining the hardness of the soapstone since the density varies. It was easier to work with the softer stone. I would start by axe-chipping it, and as I was doing this I would start visualizing it. The shape of the stone also provided me with ideas. As I axed it gradually, my thoughts would go: This is shaping like this... It is going to be… and the carving being formed would follow my thoughts from there. ...We used shoe polish to darken the stone because it made the carvings more attractive and shiny.', NULL, 5);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(5, 'Man', 1982, NULL, 4, 5);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(3, 'Man with Seal', 1987, NULL, 4, 5);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(1, 'Seal Hunter', NULL, 'a black stone carving of a hunter with seal', 4, 5);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(2, 'Mona Lisa', 1506, 'Considered an archetypal masterpiece of the Italian Renaissance, it has been described as \"the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world\". The painting''s novel qualities include the subject''s enigmatic expression, monumentality of the composition, the subtle modeling of forms, and the atmospheric illusionism.', 1, 2);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(3, 'The Weeping Woman', 1937, 'The Weeping Woman (French: La Femme qui pleure) is a series of oil on canvas paintings by Pablo Picasso, the last of which was created in late 1937. The paintings depict Dora Maar, Picasso''s mistress and muse. The Weeping Woman paintings were produced by Picasso in response to the bombing of Guernica in the Spanish Civil War and are closely associated with the iconography in his painting Guernica. Picasso was intrigued with the subject of the weeping woman, and revisited the theme numerous times that year. The last version, created on 26 October 1937, was the most elaborate of the series, and has been housed in the collection of the Tate Modern in London since 1987. Another Weeping Woman painting is housed at the National Gallery of Victoria and was involved in a high-profile political art theft.', 2, 1);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(3, 'Alien Invasion', 2021, 'Digital creation depicting contact between an unidentified flying object and humankind.', 3, 7);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(2, 'Hula Hoop', 2016, 'Kids playing in the sun on a summer day.', 3, 7);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(4, 'Stubbed Toe', 2008, 'The pain of squishing a foot against a corner.', 3, 7);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(2, 'Electric Boogaloooo', 2020, 'It is a true electric boogaloo 2 when it came out.', 3, 6);

INSERT INTO Art (owner_id,title,year_created,description, exhibit_id, artist_id)
VALUES(5, 'Double Rainbow Triangles', 2022, 'Double Rainbow Triangles? What does it mean?', 3, 6);

INSERT INTO Makes (art_id, artist_id) 
VALUES(1, 1);

INSERT INTO Makes (art_id, artist_id) 
VALUES(2, 2);

INSERT INTO Makes (art_id, artist_id) 
VALUES(3, 3);

INSERT INTO Makes (art_id, artist_id) 
VALUES(4, 4);

INSERT INTO Makes (art_id, artist_id) 
VALUES(5, 5);

INSERT INTO Makes (art_id, artist_id) 
VALUES(6, 5);

INSERT INTO Makes (art_id, artist_id) 
VALUES(7, 5);

INSERT INTO Makes (art_id, artist_id) 
VALUES(8, 5);

INSERT INTO Makes (art_id, artist_id) 
VALUES(9, 2);

INSERT INTO Makes (art_id, artist_id) 
VALUES(10, 1);

INSERT INTO Makes (art_id, artist_id) 
VALUES(11, 7);

INSERT INTO Makes (art_id, artist_id) 
VALUES(12, 7);

INSERT INTO Makes (art_id, artist_id) 
VALUES(13, 7);

INSERT INTO Makes (art_id, artist_id) 
VALUES(14, 6);

INSERT INTO Makes (art_id, artist_id) 
VALUES(15, 6);

INSERT INTO Sculpture (art_id, material, size)
VALUES(4, 'Bronze', '24'' x 4'' x 9''');

INSERT INTO Sculpture (art_id, material, size)
VALUES(5, 'Stone', '9.5\" X 10\" X 6\"');

INSERT INTO Sculpture (art_id, material, size)
VALUES(6, 'Stone', '4⅛\" x 7⅝\" x 3⅝\"');

INSERT INTO Sculpture (art_id, material, size)
VALUES(7, 'Stone', '7¾\" x 11⅜\" x 3¾\"');

INSERT INTO Sculpture (art_id, material, size)
VALUES(8, 'Stone', '7\" x 8\" x 7\"');

INSERT INTO Digital (art_id, url)
VALUES(11, 'sarahsmith.com/alieninvasion');

INSERT INTO Digital (art_id, url)
VALUES(12, 'sarahsmith.com/hulahoop');

INSERT INTO Digital (art_id, url)
VALUES(13, 'sarahsmith.com/stubbedtoe');

INSERT INTO Digital (art_id, url)
VALUES(14, 'jayart/electricboogallooooo.com');

INSERT INTO Digital (art_id, url)
VALUES(15, 'jayart/doublerainbowtriangle.com');

INSERT INTO Painting (art_id, dimension, medium)
VALUES(1, '137.4\" x 305.5\"', 'Oil on canvas');

INSERT INTO Painting (art_id, dimension, medium)
VALUES(2, '181\" x 346\"', 'Tempera on gesso, pitch, and mastic');

INSERT INTO Painting (art_id, dimension, medium)
VALUES(3, '42.8\" x 27.1\"', 'Oil on canvas');

INSERT INTO Painting (art_id, dimension, medium)
VALUES(9, '30\" x 21\"', 'Oil on poplar panel');

INSERT INTO Painting (art_id, dimension, medium)
VALUES(10, '23 15/60\" x 19 11/16\"', 'Oil on canvas');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(1, 1, '2013-11-15');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(2, 2, '1999-04-21');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(3, 3, '2000-02-21');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(4, 4, '1998-12-25');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(5, 5, '2020-01-01');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(5, 6, '2022-03-01');

INSERT INTO Manages (curator_id, gallery_id, starting_date)
VALUES(4, 7, '2020-12-12');

INSERT INTO Oversees (curator_id, exhibit_id)
VALUES(2, 1);

INSERT INTO Oversees (curator_id, exhibit_id)
VALUES(1, 2);

INSERT INTO Oversees (curator_id, exhibit_id)
VALUES(5, 3);

INSERT INTO Oversees (curator_id, exhibit_id)
VALUES(4, 4);

INSERT INTO Oversees (curator_id, exhibit_id)
VALUES(4, 5);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(1, 1, '2021-09-10', 2);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(2, 2, '1924-08-13', 3);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(4, 4, '1966-07-16', 1);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(3, 3, '1999-06-17', 2);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(6, 1, '2001-05-03', 2);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(5, 2, '2022-04-02', 1);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(4, 3, '2023-03-19', 4);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(11, 5, '1852-02-23', 2);

INSERT INTO Transfers (art_id, origin, date, destination)
VALUES(12, 5, '2024-01-27', 3);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (1, '2022-04-02', 1);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (2, '2022-04-01', 1);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (3, '2022-04-12', 1);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (4, '2022-04-03', 1);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (2, '2022-11-30', 2);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (1, '2022-11-20', 2);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (3, '2022-11-12', 2);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (3, '2022-07-21', 3);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (4, '2022-03-15', 4);

INSERT INTO CustomerVisitsExhibit (customer_id, date, exhibit_id)
VALUES (5, '2022-08-03', 5);

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(1, 50, 'Adult');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(1, 40, 'Student');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(1, 25, 'Senior');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(2, 50, 'Adult');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(2, 40, 'Student');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(2, 25, 'Senior');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(3, 50, 'Adult');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(3, 40, 'Student');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(3, 25, 'Senior');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(4, 50, 'Adult');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(4, 40, 'Student');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(4, 25, 'Senior');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(5, 50, 'Adult');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(5, 40, 'Student');

INSERT INTO ExhibitCharges (exhibit_id, price, price_group)
VALUES(5, 25, 'Senior');

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (1, 1, '2022-04-02', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (2, 1, '2022-04-01', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (3, 1, '2022-04-12', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (4, 1, '2022-04-03', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (2, 2, '2022-11-30', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (1, 2, '2022-11-20', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (3, 2, '2022-11-12', 50);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (3, 3, '2022-07-21', 40);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (4, 4, '2022-03-15', 25);

INSERT INTO Visits (customer_id, exhibit_id, date, price)
VALUES (5, 5, '2022-08-03', 50);