import * as fs from "fs";
import * as path from "path";

export async function createbdd(name: string) {
    // create a new database file named name in data folder
    const bddFile = path.join(__dirname, '..', '..', 'data', `${name}.csv`);
    // check if bddFile exists and create it if not
    if (fs.existsSync(bddFile)) {
        throw new Error(`Database ${name} already exists`);
    }
    try {
        fs.writeFileSync(bddFile, '');
    } catch(error) {
        console.log(error);
    }

    console.log(`Database ${name} created`);
}