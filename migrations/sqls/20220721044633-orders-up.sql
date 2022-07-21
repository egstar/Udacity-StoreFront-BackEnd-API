/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS orders ( 
  orderid serial PRIMARY KEY,
  odate DATE DEFAULT CURRENT_DATE,
  ostatus VARCHAR(50) DEFAULT 'Active',
  ototal INT NOT NULL,
  userid INT NOT NULL REFERENCES users(userid) ON DELETE NO ACTION
);