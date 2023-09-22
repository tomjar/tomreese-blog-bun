import { Database } from "bun:sqlite";


const Event = {
    /**
     * 
     * @returns 
     */
    getAll: function () {
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
     * @returns Promise<any>
     */
    insertEvent: async function (ipaddress, category, description) {

        return new Promise((resolve, reject) =>{
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query('INSERT INTO Event(ip_address, category, description, createtimestamp) VALUES (?1, ?2, ?3, ?4);');
            const result = query.all(ipaddress, category, description, Date.now());
            sqliteDb.close();
            resolve(result);
        });

    }
}

export default Event;