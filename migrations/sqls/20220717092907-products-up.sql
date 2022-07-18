/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products ( 
  pid serial PRIMARY KEY,
  pname VARCHAR(255) NOT NULL,
  pdesc TEXT NOT NULL,
  pprice INT NOT NULL
);