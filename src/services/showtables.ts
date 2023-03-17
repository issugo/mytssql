import path from "path";
import fs from "fs";
const Table = require('cli-table');

export async function showTables(name: string) {
    // search for every file starting by name_ in data folder
    // and display their name
    const dataFolder = path.join(__dirname, '..', '..', 'data')
    const allBdd = fs.readdirSync(dataFolder)
    const tables = allBdd.filter(bdd => bdd.startsWith(`${name}_`))
    const cli_table = new Table({
        head: ['Table', 'created at']
    })
    tables.forEach(table => {
        const stats = fs.statSync(path.join(dataFolder, table))
        const createdAt = stats.birthtime.toISOString()
        cli_table.push([table.replace('.csv', '').replace(`${name}_`, ''), createdAt])
    })
    console.log(cli_table.toString())
}