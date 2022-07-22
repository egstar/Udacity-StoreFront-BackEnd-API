
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
| Route                   | HTTP Methods | Description                                |    Requirements    | Usage     |
| ----------------------- |:------------:| ------------------------------------------ | ------------------ |:--------- |
| **```/user```**         | `[GET]`      | __Index__ of users with user list,         | User token         |    -      |
| **```/user/:id```**     | `[GET]`      | __Show__ single user using _[**userID**]_  | User token         |  `userid` |
| **```/user/login```**   | `[POST]`     | __Authenticate__ the current user          |  Generates  Token  | `{ "user": "CURRENT_USERNAMe", "pass": "CURRENT_PASSWORD"}` |
| **```/user/signup```**  | `[POST]`     | __Create__ a new user                      | No token required  | `{ "username": "NEW_USER_NAME", "email": "USER_EMAIL", "firstname": "USER_FIRST_NAME", "lastname": "USER_LAST_NAME", "userpass": "USER_PASSWORD" }` |

<sub> *Users requirments* </sub>

1) to get single user info use [GET] with path `[ /user/:id ]` using the user id
2) generate a token use [POST] with path `[ /user/login ]` and send JSON row with _{"user":`USER-USERNAME`, "pass":`USER-PASSWORD`}_
3) to create a user use [POST] with path `[ /user/signup ]` and send JSON row with 
  _{"username":`USERNAME`, "firstname":`FIRSTNAME`, "lastname":`LASTNAME`, "email":`EMAIL`, "userpass":`PASSWORD`}_

> ***NOTE***
> Please use the [ *./db_data/init_data.sql* ]  as a data population for tables,
>
> you can use __USER__: _admin_, __PASS__: _h4sh3dp4ssw0rd_ [**using the Bcrypt default password**]

----
###### `▶️ Products Route`
|  Route               | HTTP Methods |            Description                     | Requirements   | Data to send |
| -------------------- |:------------:| ------------------------------------------ | -------------- | ------------ |
| **```/prod```**      | `[GET]`      | __Index__ of products with list            | No token       | -            |
| **```/prod/:pid```** | `[GET]`      | __Show__ single Product by _[**pordID**]_  | No token       | `PRODUCT_ID` |
| **```/prod/new```**  | `[POST]`     | __Create__ a new Product                   | Token required | `{"pname": "PRODUCT_NAME", "pdesc": "PRODUCT_DESCRIPTION", "pprice": PRODUCT_PRICE}` |

<sub> *Products requirments* </sub>

1) get all products list use [GET] with path`[ /prod/ ]` _(no token required)_
2) get single product info use [GET] with path `[ /prod/:pid ]` using the product id & _(no token required)_
3) to create a product use [POST] with path `[ /prod/new ]` and send _(Admin token)_ and JSON row with 
{ "pname": `PRODUCT-NAME`,"pdesc": `PRODUCT-DESCRIPTION`, "pprice": `PRODUCT-PRICE` }

----
###### `▶️ Orders Route`
|             Route         | HTTP Methods |                  Description                   | Requirements |    Data to send     |
| ------------------------- |:------------:| ---------------------------------------------- | ------------ | ------------------- |
| **```/orders```**         |   `[GET]`    | __Index__ of Orders list                       |  User token  |         -           |
| **```/user/:id/order```** |   `[GET]`    | __Show__  order by __[**OrderID**]__           |  User token  |      `orderid`      |
| **```/order/:id```**      |   `[GET]`    | __Show__ order by  _[**userID&orderStatus**]_  |  User token  | `userid`, `Ostatus` |
| **```/order/new```**      |   `[POST]`   | __Make__ a new order                           |  User Token  | `{ "userid": ORDERING_USER_ID, "products": "{'pid': [Products_ID], 'qty': [QUANTITY_FOR_EACH] }", "ostatus": "ACITVE_OR_COMPLETE" }` |

<sub> *Orders requirments* </sub>

1) get all orders list use [GET] with path`[ /orders/ ]` _(User token required)_
2) get single user _Active_ order [GET] with path `[ /user/:id/order ]` using the  _(token required)_ ,
  { "userid": `USER-ID`, "ostatus": ["`ACTIVE`"|"`COMPLETE`"] }

3) to get a single order by _[orderId]_ use [GET] with path `[ /order/:id ]` using _(ORDER-ID)_,  _(required user token)_
4) to create anew order use [POST] with path `[ /order/new ]` and send _(user token)_ and JSON row with 
{ "products": [
    {"pid":`PRODUCT-ID`, "qty":`QUANTITY-OF-PRODUCT`},
    {"pid":`ANOTHER-PRODUCT`, "qty":`QUANTITY-OF-PRODUCT`}
    ]}

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
| **```rid```**       |     `INT`      | __DEFAULT(1)__, __FOREIGN KEY__ | __roles(rid)__ ( ON *DELETE* SET DEFAULT ON *UPDATE* CASCADE ) |

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
| **```userid```**   |     `INT`     | __DEFAULT 1__, __FOREIGN KEY__ | __users(userid)__ ( ON _DELETE_ SET DEFAULT ) |

###### `▶️ Order products table`
|    Column name    | Data Type   |        Constraints            |                References                  |
| ----------------- |:-----------:| ----------------------------- | ------------------------------------------ |
| **```orderid```** |    `INT`    | __NOT NULL__, __FOREIGN KEY__ | __orders(orderid)__ ( ON _DELETE_ CASCADE) |
| **```pid```**     |    `INT`    | __NOT NULL__, __FOREIGN KEY__ | __products(pid)__ ( ON _DELETE_ NO ACTION) |
| **```pqnty```**   |    `INT`    | __NOT NULL__                  |                  -                         |


###### `▶️ Roles table`
|    Column name  |   Data Type   | Constraints                   |  References  |
| --------------- |:-------------:| ----------------------------- | ------------ |
| **```rid```**   |    `SERIAL`   | __PRIMARY KEY__, __NOT NULL__ |       -      |
| **```rname```** | `VARCHAR(50)` | __NOT NULL__                  |       -      |
