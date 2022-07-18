/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS orders ( 
  orderid serial PRIMARY KEY,
  odate DATE DEFAULT GETDATE(),
  ostatus VARCHAR(50) DEFAULT "Active",
  ototal INT NOT NULL,
  userid INT DEFAULT 1 REFERENCES users(userid) ON DELETE SET DEFAULT
);