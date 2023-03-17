import path from "path";
import fs from "fs";
const Table = require('cli-table');

export async function describe(dbName: string, tableName: string) {
    // search for a file named dbName_tableName.csv in data folder and print its first line
    const bddFile = path.join(__dirname, '..', '..', 'data', `${dbName}_${tableName}.csv`)
    let columns: Array<string> = []
    const allFileContents = fs.readFileSync(bddFile, 'utf-8')
    columns = allFileContents.split(/\r?\n/)[0].split(';')
    const cli_table = new Table({
        head: ['Column']
    })
    columns.forEach(column => {
        cli_table.push([column])
    })
    console.log(cli_table.toString())
}