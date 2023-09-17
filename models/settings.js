import { Database } from "bun:sqlite";

const Settings = {

    /**
     * 
     * @param {String} archive_view 
     * @param {String} about_section 
     */
    updateSettings: function (archive_view, about_section) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        // TODO: need way to update setting for about area?
        // insert not update?
        const query = sqliteDb.query(`UPDATE Setting SET archive_view=?1, about_section=?2;`);
        const result = query.all(archive_view, about_section);
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @returns 
     */
    getSettings: function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, archive_view, about_section FROM Setting LIMIT 1;`);
        const result = query.all();
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @returns 
     */
    insertDefaultSettings: function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`INSERT INTO Setting(archive_view, about_section) VALUES ( ?1, ?2);`);
        const result = query.all('date', 'fill out your about section in the admin settings page.');
        sqliteDb.close();
        return result;
    }
}

export default Settings;