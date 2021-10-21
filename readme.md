# Welcome to the Joyn API

This is the repository for the API and backend for Joyn. All API requests made by the mobile application and control panel are made to endpoints defined within this repository. As such, this can be defined as the backbone of Joyn's business logic.

It is currently hosted on AWS and relies on Postgresql as a database.

## Prerequisites

In order to successfully run the code in this repository, you will need to have the following installed on your machine.

1. NodeJS with `npm`
2. Postgresql

## Setup

Copy or rename the `.env.sample` file to `.env`. Populate the environment variables with the appropriate values.

## Database setup

Create a postgresql database called `joyn` by default and make sure the database server is running.

Update the `.env` database `DB_HOST`, `DB_PORT`, `DB_USERNAME` and `DB_PASSWORD` if you haven't already. The host and port defaults should work by default assuming normal setup.

## Installation

Run `npm install` in the root directory (where the `package.json` file is) to install dependencies.

## Running the backend

To run the backend, run `npm start` in the root directory.

**Note:** Currently, when the server runs locally, ElasticSearch won't work and you will get an error message

## Testing the API

When running locally, you can test the API by making a request to `localhost:3000/{endpoint}` where `{endpoint}` is the specific endpoint you want to call. For example `localhost:3000/auth/signin` is a valid endpoint when testing locally.

For a list of the current API endpoints, check the `app/routes/` directory.

There are currently two sub-directories when it comes to routes: `admin/` and `front/`.

**Note:** For any examples given within this section (_Testing the API_), we shall be assuming that all paths represent directories or files that fall within the `app/routes/` directory.

### The `admin/` directory

The `admin/` directory represents routes that are used with the [admin panel](https://github.com/JoynConnect/control-panel), which is a web application used by Joyn administrators. It is an internal tool for adding internal database records and is **NOT** accessible to customers.

### The `front/` directory

The `front/` directory represents the public facing APIs that are used by the Joyn mobile app. This means that the endpoints within this section **ARE** accessible to customers.

### Routes structure

Both the `admin/` and `front/` route directories share the same structure. They each contain a `router/` directory, a `config.js` file and an `index.js` file.

We'll go over these in order of significance.

- The `config.js` file in both `admin/` and `front/` contains objects that contain the paths to the various API endpoints defined within their respective `router/` directories.

- The `router/` directory contains files that correspond to our individual route groups.

_Buzzword alert._ **Route group:** a group of routes (no kidding) that operate within a specific domain. For example: authentication functionality can involve _signin, signup, forgot password_ etc. Such functionality would be grouped together in a single file that represents the authentication route group. In the case of this codebase, for the `app/routes/admin/` routes, authentication routes would be found in `app/routes/admin/router/auth.js`. This analogy translates into other domains where each file in a **`router/`** directory corresponds to a set of API endpoints (also called routes) that operate within a given domain.

# Contributing

To start contributing to the codebase, kindly reference the [contribution guide](https://github.com/). This guide contains details on the structure as well as architectural choices, coding style guides and more.
