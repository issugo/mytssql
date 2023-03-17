import path from "path";
import fs from "fs";

export async function insertTable(bddName: string, tableName: string, datas: Array<string>) {
    const tableFile = path.join(__dirname, '..', '..', 'data', `${bddName}_${tableName}.csv`)
    // check if bddFile exists and create it if not
    if (!fs.existsSync(tableFile)) {
        console.error(`table ${tableName} does not exists`)
    } else {
        let columns: Array<string> = []
        const allFileContents = fs.readFileSync(tableFile, 'utf-8')
        columns = allFileContents.split(/\r?\n/)[0].split(';')
        if (columns.length !== datas.length) {
            console.error(`table ${tableName} has ${columns.length} columns but ${datas.length} values were provided`)
        } else {
            try {
                fs.appendFileSync(tableFile, datas.join(';'))
                fs.appendFileSync(tableFile, '\n')
            } catch(error) {
                console.log(error)
            }
        }
    }


}