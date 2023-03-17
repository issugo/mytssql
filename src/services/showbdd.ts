import * as path from "path";
import * as fs from "fs";
const Table = require('cli-table');

export async function showbdd() {
    // read every file in data folder
    // and display their name
    const dataFolder = path.join(__dirname, '..', '..', 'data');
    const bdd = fs.readdirSync(dataFolder);
    const table = new Table({
        head: ['Database', 'created at']
    })
    bdd.forEach(bdd => {
        const stats = fs.statSync(path.join(dataFolder, bdd));
        const createdAt = stats.birthtime.toISOString();
        table.push([bdd.replace('.csv', ''), createdAt]);
    })
    console.log(table.toString())
}