# Udacity Project <sub>( StoreFront BackEnd API )</sub>
> __Table of content__ 
Udacity Project ( StoreFront BackEnd API )
  * [App Installation and configuration](#-app-installation-and-configuration)
    * [`▶️ Requirements`](#%EF%B8%8F-requirements)
        * [Main App requirements](#-main-app-requirements)
        * [Our included Dependencies](#-our-included-dependencies) _( [Dev](#-dev-dependencies) | [Dep](#-dependencies) )_
            * [Dev dependencies](#-dev-dependencies)
            * [Dependencies](#-dependencies)
    * [`▶️ Configuration`](#%EF%B8%8F-configuration)
        * [How to setup](#-how-to-setup)
        * [Config the .env file](#-config-the-env-file)
    * [`▶️ Migrations`](#%EF%B8%8F-migrations)
        * [Database schema migration](#-database-schema-migration)
        * [Data populate](#-data-populate)
  * [App Running and Usage](#-app-running-and-usage)
    * [`▶️ Testing Using Jasmine`](#%EF%B8%8F-testing-using-jasmine)
    * [`▶️ Starting the server`](#%EF%B8%8F-starting-the-server)
    * [`▶️ End Points`](#%EF%B8%8F-end-points)
    ---


                          Welcome to Udacity World - Full stack Projects 

## ➖ APP Installation and configuration 
We're going to show you step by step how to setup and install all required parts to get the project running successfully without any problems
### `▶️ Requirements`
##### `🌠 Main App requirements` 
| Name | Version | How to install |
|---| ------| --- |
|NodeJs | 16.5.1 | [NodeJs installation and Setup](https://nodejs.org/en/download/) |
| npm | 8.13.2 | [NPM installation Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) |

You need to install node.JS first to start using the App, and then get the npm (_Node Package Manager_) to install needed dependencies.

#### `📦 Our included Dependencies` 
We're going to show up a list of all Dependencies included into the _Package.json_  
###### `🔲 Dev-Dependencies`
You can install any of this dependencies using the command below:
```
    npm i -D <PackageName>
```
|Dependency name | Version | - | Dependency Name | Version |
|---|---|:---:| ---|---|
| **@types/bcrypt** | _^5.0.0_ |-| **db-migrate** | _^0.11.13_ |
| **@types/express** | _^4.17.9_ |-| **db-migrate-pg** | _^1.2.2_ |
| **@types/jasmine** | _^3.6.3_ |-| **eslint** | _^8.19.0_ |
| **@types/jsonwebtoken** | _^8.5.8_ |-| **eslint-config-prettier** | _^8.5.0_ |
| **@types/pg** | _^7.14.7_ |-| **eslint-plugin-prettier** | _^4.2.1_ |
| **@types/prettier** | _^2.6.3_ |-| **jasmine** | _^3.6.4_ |
| **@types/supertest** | _^2.0.12_ |-| **jasmine-spec-reporter** | _^7.0.0_ |
| **@typescript-eslint/eslint-plugin** | _^5.30.5_ |-| **jasmine-ts** | _^0.3.0_ |
| **@typescript-eslint/parser** | _^5.30.5_ |-| **nodemon** | _^2.0.19_ |
| **prettier** | _^2.7.1_ |-| **supertest** | _^6.2.4_ |
| **ts-node** | _^10.9.1_ |-| **tsc-watch** | _^4.2.9_ |


###### `🔲 Dependencies`
All of the shown dependencies below can be installed with the command:

```
    npm i <PackageName>
```

|Dependency name | Version |
|---|---|
| **bcrypt** | *5.0.1* |
| **body-parser** | *1.19.0* |
| **dotenv** | *16.0.1* |
| **ejs** | *3.1.8* |
| **express** | *4.17.1* |
| **jsonwebtoken** | *8.5.1* |
| **pg** | *8.5.1* |
| **typescript** | *4.7.4* |

---
### `▶️ Configuration`

Let's start configuring our App to make everything stable and start running the App.

#### `🔲 How to setup`
After getting the ` NodeJs ` and ` npm ` installed, we need to build our App by running some commands to get it start.

1) Installing node_modules, dependencies and main data

        npm i

2) Start building the app to get the Js files located at the ` ./dist/ ` folder.

        npm run build
    
3) We can fix typing Error if there is any, as we added Eslint package for typing checking and fixing

        npm run lint:f
    
4) We can also fix code style using Prettier package

        npm run pret:f


#### `🔲 Config the .env File`
For security reasons we've moved our main App environments, to the .env File, you need to check the below table and create the .env file with the required variables to get the App running with no errors

| Variable | Default | Usage |
|----------|:-------:|-------|
|ENV | **dev** | Set the app running mode between (_test_ | _dev_ ) |
|APP_HOST | **localhost**| The server which your app running on |
|APP_PORT | **3000** | the used port for reaching the App end points |
|DB_HOST | **localhost** | The host of your PostgreSQL database |
|DB_PORT | **5432** | The port of the PostgreSQL database |
|DB_USER | - | The Database username |
|DB_PASS | - | The Database password |
|DB_NAME | - | The name of the __(Main)__ Database |
|DB_TEST | - | The name of the __(Test)__ Database |
|BCRYPT_PASSWORD| **34syp4ssw0rd** | Create a hard password for Bcrypt hashing as Pepper |
|SALT_ROUNDS | **10** | The number of passwords hashing rounds |
|SECRET_TOKEN | - | Create a hard secret key for JSON-Web-Token |


### `▶️ Migrations`
Let's move to the last part of app setup which is the Database Schema Migration and Table Populate using Data
#### `🔲 Database schema Migration`
We're going now to create our Database tables after setting the **DB_NAME** & the **DB_TEST** at the _.env_ file.

1) Migrate data Up

		$  npx db-migrate up 
		$  npx db-migrate --env test up

2) Migrate data Down

		$  npx db-migrate down
		$  npx db-migrate --env test down

3) Reset Migrated data 

    $  npx db-migrate reset
    $  npx db-migrate --env test reset


**_NOTE :_  We're using ``` --env test ``` for targeting the test database.**

#### `🔲 Data Populate`

Now it's time to put some data into the created tables, so we can use it later through the App.

to do that we need to run this command

      psql -U <DATABASE_USER> -d <DATABASE_NAME> -a -f ./db_data/<FILE_NAME>.sql

We've added (2) files for Data population, 
  - [***init_data.sql***] is used to the main users and some orders for app start-up
  - [***roles_data.sql***] is used to add the roles only (PLEASE USE IT FOR UNIT TESTING OR IT WILL FAIL)
----
## ➖ APP Running and Usage
### `▶️ Testing using Jasmine`

> We can say now that's everything is OK, time for testing the App before starting it,

##### Units tested

  - **End points** tests includes [ <sub>***Users Routes*** | ***Orders Routes*** | ***Products Routes*** </sub>]
  - **Database** tests includes [ <sub>***Database Connection*** | ***INSERT*** | ***SELECT*** | ***UPDATE*** | ***DELETE*** </sub>]
  - **Models** tests includes [ <sub>***Users Model*** | ***Orders Model*** | ***Products Model*** </sub>]

to check the tests run the unit testing using the below command

        npm run test

> ***PLEASE NOTE THAT***
- you need to set the value of **DB_TEST** in the _.env_ file.
- populated the ***./db_data/roles_data.sql*** to add _admin_ & _user_ privileges into the ***roles*** table
### `▶️ Starting the server`

Now it's time to see how it works.
> Firstly, Let's run the build **script** after finishing our _.env_ file

      npm run build

> For running the _development_ mode, run the command below

      npm run dev

> For running the server up, use the below command

      npm run watch

---
### `▶️ End Points`

> Please go to the [REQUIREMENTS.md](/docs/REQUIREMENTS.md) to find all Routes, And Database tables
