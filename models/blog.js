import { Database } from "bun:sqlite";


const Blog = {

    /**
     * 
     * @param {Number} id 
     * @returns 
     */
    deleteBlogPermanently: function (id) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`DELETE FROM Blog WHERE id = ?1;`);
        const result = query.all(id);
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @param {Boolean} ispublished 
     * @param {Number} id 
     * @returns 
     */
    updateBlogPublished: function (ispublished, id) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`UPDATE Blog SET ispublished=?1, modifytimestamp=?2 WHERE id = ?3;`);
        const result = query.all(ispublished, Date.now(), id);
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @param {Number} id 
     * @returns 
     */
    updateBlogModifiedTimestamp: function (id) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`UPDATE Blog SET modifytimestamp=?1 WHERE id = ?2;`);
        const result = query.all(Date.now(), id);
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @param {String} category 
     * @param {String} header 
     * @param {Boolean} ispublished 
     * @param {String} description 
     * @param {String} body 
     * @param {Number} id 
     * @returns 
     */
    updateBlog: function (category, header, ispublished, description, body, id) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`UPDATE Blog SET category=?1, header=?2, modifytimestamp=?3, ispublished=?4, description=?5, body=?6 WHERE id = ?7;`);
        const result = query.all(category, header, Date.now(), ispublished, description, body, id);
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @param {String} header 
     * @param {String} description 
     * @param {String} name 
     * @param {String} category 
     * @param {String} body 
     */
    insertBlog: function (header, description, name, category, body) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`INSERT INTO Blog(header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) VALUES (?1, ?2, NULL, false, ?3, ?4, ?5, ?6);`);
        const result = query.all(header, Date.now(), description, name, category, body);
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @param {Number} id 
     * @returns 
     */
    getBlogById: function (id) {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog WHERE id=?1;`);
        const result = query.all(id);
        sqliteDb.close();

        if (result) {
            return result[0];
        } else {
            return null;
        }
    },
    /**
     * 
     * @param {String} name 
     * @returns { id, header, }
     */
    getBlogByName: function (name) {

        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header,date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog WHERE name = ?1 LIMIT 1`);
        const result = query.all(name);
        sqliteDb.close();

        if (result) {
            return result[0];
        } else {
            return null;
        }
    },
    /**
     * 
     * @returns 
     */
    getAll: function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog ORDER BY createtimestamp DESC;`);
        const result = query.all();
        sqliteDb.close();

        return result;
    },
    /**
     * 
     * @returns 
     */
    getAllPublished: function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category FROM Blog WHERE ispublished = true ORDER BY createtimestamp DESC;`);
        const result = query.all();
        sqliteDb.close();
        return result;
    },

    /**
     * 
     * @returns 
     */
    getAllPublishedLastThirtyDays: function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const today = new Date();
        const query = sqliteDb.query(`SELECT * FROM Blog WHERE createtimestamp >= ?1`);
        const result = query.all(new Date().setDate(today.getDate() - 30));
        sqliteDb.close();
        return result;
    },
    /**
     * 
     * @returns 
     */
    getAllArchived: function () {
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header,date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog ORDER BY createtimestamp desc;`);
        const result = query.all();
        sqliteDb.close();

        const data = typeof result === 'undefined' ? [] : result;

        const uniqueYears = data.map(item => {
            return new Date(item.createtimestamp).getFullYear();
        }).filter((item, index, arr) => {
            return arr.indexOf(item) === index;
        });

        const yearAndBlogs = uniqueYears.map(uy => {
            return {
                'year': uy,
                'blogs': data.filter(p => {
                    return new Date(p.createtimestamp).getFullYear() === uy;
                })
            }
        });

        return yearAndBlogs;
    }
}

export default Blog;