import figlet from "figlet";
import { Database } from "bun:sqlite";

const Utility = {
    /**
     * 
     * @param {String} text 
     */
    generateFiglet: function (text) {


    },
    /**
     * 
     */
    seedSqliteDb: async function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");

        const contentsPath = "./blogs.json";
        const file = Bun.file(contentsPath);
        const contents = await file.json();

        sqliteDb.exec("CREATE TABLE IF NOT EXISTS Event ( id INTEGER PRIMARY KEY,ip_address TEXT, category TEXT,description TEXT,createtimestamp NUMERIC);");
        sqliteDb.exec("CREATE TABLE IF NOT EXISTS Message ( id INTEGER PRIMARY KEY,ip_address TEXT,body TEXT,createtimestamp NUMERIC,createdby TEXT);");
        sqliteDb.exec("CREATE TABLE IF NOT EXISTS Blog ( id INTEGER PRIMARY KEY,header TEXT,createtimestamp NUMERIC,modifytimestamp NUMERIC,ispublished NUMERIC,description TEXT,name TEXT,category TEXT,body TEXT);");
        sqliteDb.exec("CREATE TABLE IF NOT EXISTS Setting ( id INTEGER PRIMARY KEY,archive_view TEXT,about_section TEXT);");
        sqliteDb.exec("CREATE TABLE IF NOT EXISTS Sspw ( id INTEGER PRIMARY KEY,salt TEXT,pw TEXT,username TEXT,createtimestamp NUMERIC,modifytimestamp NUMERIC);");

        for (let x = 0; x < contents.length; x++) {

            let name = contents[x].name;
            let blogBodyPath = `./blogs-txt/${name}.txt`;
            let blogBodyFile = Bun.file(blogBodyPath);

            let blogBody = await blogBodyFile.text();


            let tempinsert = sqliteDb.query(`INSERT INTO Blog(header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) values(?1,?2,?3,?4,?5,?6,?7,?8);`);

            tempinsert.all(contents[x].header,
                Date.parse(contents[x].createtimestamp),
                Date.parse(contents[x].modifytimestamp),
                contents[x].ispublished ? 1 : 0,
                contents[x].description,
                contents[x].name,
                contents[x].category,
                blogBody);
        }

        let tempauthinsert = sqliteDb.query(`INSERT INTO Sspw(salt,pw,username,createtimestamp,modifytimestamp) values(?1,?2,?3,?4,?5);`);

        tempauthinsert.all(null,null,'Progeny2215',Date.now(), null);

        sqliteDb.close();
    }

}

export default Utility;