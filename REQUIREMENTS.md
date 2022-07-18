
# Udacity Project <sub>( StoreFront BackEnd API )</sub>



> __Table of content__ 
Udacity Project ( StoreFront BackEnd API )
  * [API Restful Routes](#-api-restful-routes)
    * [`Users routes`](#%EF%B8%8F-users-route "Users Routes")
    * [`Products routes`](#%EF%B8%8F-products-route "Products Routes")
    * [`Orders routes`](#%EF%B8%8F-orders-route "Orders Routes")
  * [Database tables schema](#-database-tables-schema)
    * [`users Schema`](#%EF%B8%8F-users-table "Database table users schema")
    * [`products Schema`](#%EF%B8%8F-products-table "Database table products schema")
    * [`orders Schema`](#%EF%B8%8F-orders-table "Database table orders schema")
    * [`order_products Schema`](#%EF%B8%8F-order-products-table "Database orders_products schema")
    * [`roles Schema`](#%EF%B8%8F-roles-table "Database table user roles schema")


# Project Information

## ➖ API Restful Routes 
###### `▶️ Users Route`
| Route                   | HTTP Methods | Description                                | Requirements | Usage     |
| ----------------------- |:------------:| ------------------------------------------ | ------------ |:--------- |
| **```/user```**         | `[GET]`      | __Index__ of users with user list,         | User token   |    -      |
| **```/user/:id```**     | `[GET]`      | __Show__ single user using _[**userID**]_  | User token   | `USER_ID` |
| **```/user/```**        | `[POST]`     | __Create__ a new user | No token required  | `{ "username": "NEW_USER_NAME", "email": "USER_EMAIL", "firstname": "USER_FIRST_NAME", "lastname": "USER_LAST_NAME", "userpass": "USER_PASSWORD" }` |


###### `▶️ Products Route`
| Route               | HTTP Methods |            Description                     | Requirements | Data to send |
| ------------------- |:------------:| ------------------------------------------ | ------------ | ------------ |
| **```/prod```**     | `[GET]`      | __Index__ of users with user list,         | User token   | -            |
| **```/prod/:id```** | `[GET]`      | __Show__ single user using _[**userID**]_  | User token   | `PRODUCT_ID` |
| **```/prod/```**    | `[POST]`     | __Create__ a new user                      | No token     | `{ "pname": "PRODUCT_NAME", "pdesc": "PRODUCT_DESCRIPTION", "pprice": PRODUCT_PRICE_AS NUMBER" }` |

###### `▶️ Orders Route`
|         Route        | HTTP Methods |                  Description               | Requirements | Data to send |
| -------------------- |:------------:| ------------------------------------------ | ------------ | ------------ |
| **```/order```**     |   `[GET]`    | __Index__ of users with user list          | User token   |     -        |
| **```/order/:id```** |   `[GET]`    | __Show__ single user using _[**userID**]_  | User token   |  `ORDER_ID`  |
| **```/order/```**    |   `[POST]`   | __Make__ a new order                       |  No token    | `{ "userid": ORDERING_USER_ID, "products": "{'pid': [Products_ID], 'qty': [QUANTITY_FOR_EACH] }", "ostatus": "ACITVE_OR_COMPLETE" }` |

------


------


------

## ➖ Database tables schema
###### `▶️ Users table`
|     Column name     |    Data Type   | Constraints                     |  References  |
| ------------------- |:--------------:| ------------------------------- | ------------ |
| **```userid```**    |    `SERIAL`    | __PRIMARY KEY__ , __NOT NULL__  |        -     |
| **```username```**  | `VARCHAR(50)`  | __NOT NULL__ , **_UNIQUE_**     |        -     |
| **```email```**     | `VARCHAR(50)`  | __NOT NULL__ , **_UNIQUE_**     |        -     |
| **```firstname```** | `VARCHAR(25)`  | __NOT NULL__                    |        -     |
| **```lastname```**  | `VARCHAR(25)`  | __NOT NULL__                    |        -     |
| **```userpass```**  | `VARCHAR(255)` | __NOT NULL__                    |        -     |
| **```roleid```**    |     `INT`      | __DEFAULT 1__                   | __roles(rid)__, __FOREIGN KEY__ ( ON *DELETE* SET DEFAULT ON *UPDATE* CASCADE ) |

###### `▶️ Products table`
|    Column name   |   Data Type   |           Constraints         |  References  |
| ---------------- |:-------------:| ----------------------------- | ------------ |
| **```pid```**    |    `SERIAL`   | __PRIMARY KEY__, __NOT NULL__ |       -      |
| **```pname```**  | `VARCHAR(50)` |          __NOT NULL__         |       -      |
| **```pdesc```**  |     `TEXT`    |          __NOT NULL__         |       -      |
| **```pprice```** |     `INT`     |          __NOT NULL__         |       -      |

###### `▶️ Orders table`
|     Column name    |   Data Type   |           Constraints          |  References  |
| ------------------ |:-------------:| ------------------------------ | ------------ |
| **```orderid```**  |    `SERIAL`   | __PRIMARY KEY__, __NOT NULL__  |       -      |
| **```odate```**    |    `DATE`     | __DEFAULT GETDATE()__          |       -      |
| **```ostatus```**  | `VARCHAR(50)` | __DEFAULT "Active"__           |       -      |
| **```ototal```**   |     `INT`     | __NOT NULL__                   |       -      |
| **```userid```**   |     `INT`     | __DEFAULT 1__                  | __users(userid)__, __FOREIGN KEY__ ( ON _DELETE_ SET DEFAULT ) |

###### `▶️ Order products table`
|    Column name    | Data Type   |  Constraints |                          References                         |
| ----------------- |:-----------:| ------------ | ----------------------------------------------------------- |
| **```orderid```** |    `INT`    | __NOT NULL__ | __orders(orderid)__, __FOREIGN KEY__ ( ON _DELETE_ CASCADE) |
| **```pid```**     |    `INT`    | __NOT NULL__ | __products(pid)__, __FOREIGN KEY__ ( ON _DELETE_ NO ACTION) |
| **```pqnty```**   |    `INT`    | __NOT NULL__ |                             -                               |


###### `▶️ Roles table`
|    Column name  |   Data Type   | Constraints                   |  References  |
| --------------- |:-------------:| ----------------------------- | ------------ |
| **```rid```**   |    `SERIAL`   | __PRIMARY KEY__, __NOT NULL__ |       -      |
| **```rname```** | `VARCHAR(50)` | __NOT NULL__                  |       -      |
