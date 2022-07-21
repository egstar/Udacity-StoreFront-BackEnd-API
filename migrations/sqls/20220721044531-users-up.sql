/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users ( 
  userid serial PRIMARY KEY,
  username varchar(50) UNIQUE NOT NULL,
  email varchar(50) UNIQUE NOT NULL,
  firstname VARCHAR(25) NOT NULL,
  lastname VARCHAR(25) NOT NULL,
  userpass VARCHAR(255) NOT NULL,
  rid INT DEFAULT(1) REFERENCES roles(rid) ON UPDATE CASCADE ON DELETE SET DEFAULT
);