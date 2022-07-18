/* Creating ROLES */
INSERT INTO roles (roleName) VALUES ('User');
INSERT INTO roles (roleName) VALUES ('Admin');

/* USER DATA */
/* pass: h4sh3dp4ssw0rd */
/* PASSWORD HASHED USING BCRYPT & BCRYPT_PASSWORD=34syp4ssw0rd ( AT THE ENV FILE ) */
INSERT INTO users VALUES (1,'Default','Default@nowhere.com','Default','User',''); 
INSERT INTO users VALUES (2,'admin','admin@burhams.com','admin','User','',2);
INSERT INTO users VALUES (3,'user','User3@burhams.com','normal','User','',1);

/* PRODUCTS DATA */
INSERT INTO products VALUES (1,'Digital kitchen scale', '{"Manufactor": "Some Co.", "details": "Some more details", "Version": "1.0"}', 100);
INSERT INTO products VALUES (2,'Windows 11 Bootable DVD', '{"Manufactor": "Microsoft", "details": "Original Key included", "Version": "SDK-123"}', 600);
INSERT INTO products VALUES (3,'LG 49" LED TV WebOs', '{"Manufactor": "LG", "details": "LED Smart TV using WebOs with internal reciever", "Version": "LGWEBOSTV2016"}', 11400);
INSERT INTO products VALUES (4,'Black Shirt - Unisex', '{"Manufactor": "ZARA", "details": "Black shirt for unisex made of cotton 100%", "Version": "BSUSCODE3"}', 250);
INSERT INTO products VALUES (5,'ICE MAKER', '{"Manufactor": "Mienta", "details": "MIENTA ICE MAKER, 100WT BLACK", "Version": "MT-3525"}', 1500);
INSERT INTO products VALUES (6,'Classic shoe with lace', '{"Manufactor": "TEDHouse", "details": "Black classic shoe with lace", "Sizes": "[40-41-42-43-44-45]"}', 800);
INSERT INTO products VALUES (7,'SAMSUNG GALAXY S22 Ultra 256 - Black', '{"Manufactor": "Samsung", "details": "Samsung Galaxy S22-Ultra Black 256GB, 12GB Ram UNLOCKED", "Version": "SM-S908UZKFXAU"}', 32000);
INSERT INTO products VALUES (8,'Plastic wall paint KAPCI', '{"Manufactor": "KAPCI", "details": "KAPCI plastic wall paint white", "Version": "KWP123-white"}', 400);

/* ORDERS DATA */
INSERT INTO orders (userid,ostatus,ototal) VALUES (3,'Active', 11500);
INSERT INTO orders (userid,ostatus,ototal) VALUES (2,'Active', 3000);
INSERT INTO orders (userid,ostatus,ototal) VALUES (2,'Complete', 600);
INSERT INTO orders (userid,ostatus,ototal) VALUES (3,'Active', 750);
INSERT INTO orders (userid,ostatus,ototal) VALUES (3,'Complete', 32000);
INSERT INTO orders (userid,ostatus,ototal) VALUES (3,'Complete', 1050);
INSERT INTO orders (userid,ostatus,ototal) VALUES (2,'Complete', 1500);

/* ORDER PRODUCTS DATA */
INSERT INTO order_products VALUES(1,3,1,1);
INSERT INTO order_products VALUES(1,3,3,1);
INSERT INTO order_products VALUES(2,2,2,5);
INSERT INTO order_products VALUES(3,2,2,1);
INSERT INTO order_products VALUES(4,3,4,3);
INSERT INTO order_products VALUES(5,3,7,1);
INSERT INTO order_products VALUES(6,3,4,1);
INSERT INTO order_products VALUES(6,3,6,1);
INSERT INTO order_products VALUES(7,2,1,1);
INSERT INTO order_products VALUES(7,2,2,1);
INSERT INTO order_products VALUES(7,2,6,1);


