# CHSS
## Contributors:
- Nick Wilson
- Adam Matthews
- Lyle Lovig
- Nicholas Boos

## Project setup
Steps to get the project up and running.
1. Ensure you have a compatible version of Node.js installed (^6.9.0)
2. Run `npm install` from the root of the project directory.
3. Create a copy of the `config_template.json` file, name it `config.json`,
and populate the fields.
4. Do the same for any other necessary config files (I.E in the connector
directories).
5. Run the server by calling `node $path/to/server.js`.
6. Run `npm run build-prod` from the root of the project directory.

## Local Development
You must build the front end JavaScript code before the site will load. To do
so, just type `npm run build` from the root of the project directory.
Alternatively, you can run `npm run build-prod` to create smaller bundle files
for quicker page load times. Note that debugging with these bundles will be
significantly more difficult. If you would like the bundles to be rebuilt as
you make front end changes so that you don't have to manually rebuild
every time, you can run the command `npm run watch`.

To setup and use the database for local development
1. Install MongoDB
https://docs.mongodb.com/manual/administration/install-community/
2. Run MongoDB from terminal from path specified in setup:
    `mongod --dbpath /path/to/db`
3. Within your module, create a `db` variable and make `module.exports` a function: 
    `module.exports = (database) => {
        db = require('/relative/path/to/dbConnector')(database);
        return whateverModuleExports;
    };`
4. Place middleware that requires database access within database connection array parameter.