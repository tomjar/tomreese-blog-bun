import { Database } from "bun:sqlite";


const Blog = {

    /**
     * 
     * @param {Number} id 
     * @returns {Promise<any[]>}
     */
    deleteBlogPermanently: async function (id) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`DELETE FROM Blog WHERE id = ?1;`);
            const result = query.all(id);
            sqliteDb.close();
            response(result);
        });
    },
    /**
     * 
     * @param {Boolean} ispublished 
     * @param {Number} id 
     * @returns {Promise<any[]>}
     */
    updateBlogPublished: async function (ispublished, id) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`UPDATE Blog SET ispublished=?1 WHERE id = ?3;`);
            const result = query.all(ispublished, id);
            sqliteDb.close();
            response(result);
        });
    },
    /**
     * 
     * @param {Number} id 
     * @returns {Promise<any[]>}
     */
    updateBlogModifiedTimestamp: async function (id) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`UPDATE Blog SET modifytimestamp=?1 WHERE id = ?2;`);
            const result = query.all(Date.now(), id);
            sqliteDb.close();
            response(result);
        });
    },
    /**
     * 
     * @param {String} category 
     * @param {String} header 
     * @param {Boolean} ispublished 
     * @param {String} description 
     * @param {String} body 
     * @param {Number} id 
     * @returns {Promise<any[]>}
     */
    updateBlog: async function (category, header, ispublished, description, body, id) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`UPDATE Blog SET category=?1, header=?2, modifytimestamp=?3, ispublished=?4, description=?5, body=?6 WHERE id = ?7;`);
            const result = query.all(category, header, Date.now(), ispublished, description, body, id);
            sqliteDb.close();
            response(result);
        });
    },
    /**
     * 
     * @param {String} header 
     * @param {String} description 
     * @param {String} name 
     * @param {String} category 
     * @param {String} body 
     * @returns {Promise<any[]>}
     */
    insertBlog: async function (header, description, name, category, body) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`INSERT INTO Blog(header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) VALUES (?1, ?2, NULL, false, ?3, ?4, ?5, ?6);`);
            const result = query.all(header, Date.now(), description, name, category, body);
            sqliteDb.close();
            response(result);
        });
    },
    /**
     * 
     * @param {Number} id 
     * @returns {Promise<any>}
     */
    getBlogById: async function (id) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog WHERE id=?1;`);
            const result = query.all(id);
            sqliteDb.close();

            if (result && result.length > 0) {
                response(result[0]);
            } else {
                response(null);
            }
        });
    },
    /**
     * 
     * @param {String} name 
     * @returns {Promise<any>}
     */
    getBlogByName: async function (name) {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`SELECT id, header,date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog WHERE name = ?1 LIMIT 1`);
            const result = query.all(name);
            sqliteDb.close();

            if (result && response.length > 0) {
                response(result[0]);
            } else {
                response(null);
            }
        });
    },
    /**
     * 
     * @returns {Promise<any[]>}
     */
    getAll: async function () {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog ORDER BY createtimestamp DESC;`);
            const result = query.all();
            sqliteDb.close();
            response(result);
        });
    },
    /**
     * 
     * @returns {Promise<any[]>}
     */
    getAllPublished: async function () {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category FROM Blog WHERE ispublished = true ORDER BY createtimestamp DESC;`);
            const result = query.all();
            sqliteDb.close();
            response(result);
        })
    },

    /**
     * 
     * @returns {Promise<any[]>}
     */
    getAllPublishedLastThirtyDays: async function () {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const today = new Date();
            const query = sqliteDb.query(`SELECT * FROM Blog WHERE createtimestamp >= ?1`);
            const result = query.all(new Date().setDate(today.getDate() - 30));
            sqliteDb.close();
            if(response && response.length > 0){
                response(result);
            }else{
                response([]);
            }
        });
    },
    /**
     * 
     * @returns {Promise<{year, blogs}>}
     */
    getAllArchived: async function () {
        return new Promise((response, reject) => {
            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`SELECT id, header,date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog ORDER BY createtimestamp desc;`);
            const result = query.all();
            sqliteDb.close();

            if (result && result.length > 0) {

                const uniqueYears = result.map(item => {
                    return new Date(item.createtimestamp).getFullYear();
                }).filter((item, index, arr) => {
                    return arr.indexOf(item) === index;
                });

                const yearAndBlogs = uniqueYears.map(uy => {
                    return {
                        'year': uy,
                        'blogs': result.filter(p => {
                            return new Date(p.createtimestamp).getFullYear() === uy;
                        })
                    }
                });

                response(yearAndBlogs);
            } else {
                response({
                    'year': 1970,
                    'blogs': []
                });
            }
        });

    }
}

export default Blog;