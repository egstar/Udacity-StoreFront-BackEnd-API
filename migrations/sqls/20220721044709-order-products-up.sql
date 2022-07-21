/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS order_products (
    orderid INT NOT NULL REFERENCES orders(orderid) ON DELETE CASCADE,
    pid INT NOT NULL REFERENCES products(pid) ON DELETE NO ACTION,
    pqnty INT NOT NULL
)