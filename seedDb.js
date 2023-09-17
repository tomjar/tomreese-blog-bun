import { Database } from "bun:sqlite";

const SeedDb = {

    seedSqliteDb: async function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");

        const contentsPath = "./blogs.json";
        const file = Bun.file(contentsPath);
        const contents = await file.json();

        try {
            sqliteDb.exec("DROP TABLE Event;");
            sqliteDb.exec("DROP TABLE Message;");
            sqliteDb.exec("DROP TABLE Blog;");
            sqliteDb.exec("DROP TABLE Setting;");
            sqliteDb.exec("DROP TABLE Sspw;");


            sqliteDb.exec("CREATE TABLE Event ( id INTEGER PRIMARY KEY,ip_address TEXT, category TEXT,description TEXT,createtimestamp NUMERIC);");
            sqliteDb.exec("CREATE TABLE Message ( id INTEGER PRIMARY KEY,ip_address TEXT,body TEXT,createtimestamp NUMERIC,createdby TEXT);");
            sqliteDb.exec("CREATE TABLE Blog ( id INTEGER PRIMARY KEY,header TEXT,createtimestamp NUMERIC,modifytimestamp NUMERIC,ispublished NUMERIC,description TEXT,name TEXT,category TEXT,body TEXT);");
            sqliteDb.exec("CREATE TABLE Setting ( id INTEGER PRIMARY KEY,archive_view TEXT,about_section TEXT);");
            sqliteDb.exec("CREATE TABLE Sspw ( id INTEGER PRIMARY KEY,salt TEXT, pw TEXT, username TEXT);");
        }
        catch (e) {
            console.log("Error message:" + e.name + " type:" + e.message);
        }

        // "id": "d3b0aca0-9850-11e9-98ee-22000a8ab0ca",
        //     "header": "Hello World!",
        //         "createtimestamp": "2019-06-26T20:27:32.784Z",
        //             "modifytimestamp": "2019-07-08T19:34:21.041Z",
        //                 "ispublished": true,
        //                     "description": "Welcome to my personal website!",
        //                         "name": "firstpost",
        //                             "category": "life",
        //                                 "body": ""

        // console.log("legnth is: " + contents.length);

        for (let x = 0; x < contents.length; x++) {

            let name = contents[x].name;
            let blogBodyPath = `/home/treese/Documents/nodejs/seriousnuggets-static/public/blogs/${name}.txt`;
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
        sqliteDb.close();
    }

}

export default SeedDb;