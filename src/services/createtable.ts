import path from "path";
import fs from "fs";

export async function createTable(dbName: string, tableName: string, columns: string[]) {
    // create a new database file named name in data folder
    const bddFile = path.join(__dirname, '..', '..', 'data', `${dbName}_${tableName}.csv`)
    // check if bddFile exists and create it if not
    if (fs.existsSync(bddFile)) {
        console.error(`table ${tableName} already exists`)
    } else {
        try {
            fs.writeFileSync(bddFile, columns.join(';'))
            fs.appendFileSync(bddFile, '\n')
            console.log(`Table ${tableName} created`)
        } catch(error) {
            console.log(error)
        }
    }

}