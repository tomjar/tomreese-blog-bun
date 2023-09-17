import { Database } from "bun:sqlite";

const Settings = {

    /**
     * 
     * @param {String} archive_view 
     * @param {String} about_section 
     */
    updateSettings: function (archive_view, about_section) {
        // const qres = await db.query('UPDATE nn."Settings" SET archive_view=$1, about_section=$2;', [archive_view, about_section]);
        // return qres.rowCount;
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`UPDATE Setting SET archive_view=?1, about_section=?2;`);
        const result = query.all(archive_view, about_section);
        sqliteDb.close();

        return result;
    },
    getSettings: function () {
        // const qres = await db.query('SELECT id, archive_view, about_section FROM nn."Settings";');
        // return new settingsClass(qres.rows[0]);
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, archive_view, about_section FROM Setting LIMIT 1;`);
        const result = query.all();
        sqliteDb.close();

        return result;
    },
    insertDefaultSettings: function () {

        // const qres = await db.query('INSERT INTO nn."Settings"(id, archive_view, about_section) '
        //     + 'VALUES (uuid_generate_v1(), $1, $2);', Settings.defaultSettings);

        //     return qres.rowCount;
        // defaultSettings: ['date', 'TODO, fill out your about section in the admin settings page.'],

        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`INSERT INTO Setting(archive_view, about_section) VALUES ( ?1, ?2);`);
        const result = query.all('date', 'fill out your about section in the admin settings page.');
        sqliteDb.close();
        return result;
    }
}

export default Settings;