import path from "path";
import fs from "fs";
const Table = require('cli-table');

export async function selecttable(dbName: string, tableName: string) {
    const tableFile = path.join(__dirname, '..', '..', 'data', `${dbName}_${tableName}.csv`);
    if (!fs.existsSync(tableFile)) {
        console.error(`table ${tableName} does not exists`);
    } else {
        let columns: Array<string> = []
        const allFileContents = fs.readFileSync(tableFile, 'utf-8');
        columns = allFileContents.split(/\r?\n/)[0].split(';')
        const cli_table = new Table({
            head: columns
        })
        for (let i = 1; i < allFileContents.split(/\r?\n/).length - 1; i++) {
            cli_table.push(allFileContents.split(/\r?\n/)[i].split(';'));
        }
        console.log(cli_table.toString())
    }
}