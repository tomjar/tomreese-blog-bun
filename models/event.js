import { Database } from "bun:sqlite";


const Event = {
    getAll: function () {
        // SELECT id, ip_address, createtimestamp, category, description FROM Event ORDER BY createtimestamp DESC;
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, ip_address, createtimestamp, category, description FROM Event ORDER BY createtimestamp DESC;`);
        const result = query.all();
        sqliteDb.close();

        return result;
    },
    /**
     * 
     * @param {String} ipaddress 
     * @param {String} category 
     * @param {String} description 
     */
    insertEvent: function (ipaddress, category, description) {

        // INSERT INTO Event (ip_address, category, description, createtimestamp)
        // VALUES (?1,?2?,?3,?4);
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query('INSERT INTO Event(ip_address, category, description, createtimestamp) VALUES (?1, ?2, ?3, ?4);');
        const result = query.all(ipaddress, category, description, Date.now());

        sqliteDb.close();

        return result;
    }
}

export default Event;