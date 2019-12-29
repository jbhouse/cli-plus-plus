"use strict";
const clipboardy = require('clipboardy');
var sqlCommandMap = {
    'addStatement': (tableName) => `ALTER TABLE ${tableName || "table_name"}
ADD column_name datatype;`,
    'updateStatement': (tableName) => `UPDATE ${tableName || "table_name"}
SET column1 = value1, column2 = value2, ...
WHERE `,
    'deleteStatement': (tableName) => `DELETE FROM ${tableName || "table_name"} WHERE `,
    'selectStatement': (tableName) => `SELECT * FROM ${tableName || ""}`,
};
module.exports = {
    getSqlCommand: (userInput) => queryConstructor(userInput)
};
function queryConstructor(command) {
    let commandArray = command.split(" ");
    let sqlStatementSelector = commandArray[0] + "Statement";
    let extraInput;
    if (commandArray.length > 1) {
        extraInput = commandArray.slice(1, commandArray.length).join(" ");
    }
    clipboardy.writeSync(sqlCommandMap[sqlStatementSelector](extraInput));
}
