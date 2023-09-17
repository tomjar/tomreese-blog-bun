import { Database } from "bun:sqlite";


const Blog = {

    /**
     * 
     * @param {Number} id 
     * @returns 
     */
    deletePostPermanently: function (id) {
        // const qres = await db.query('DELETE FROM nn."Post" WHERE id = $1;',[id]);
        // return qres.rowCount;
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
    updatePostPublished: function (ispublished, id) {
        // const qres = await db.query('UPDATE nn."Post" SET ispublished=$1, modifytimestamp=now() WHERE id = $2;',[ispublished, id]);
        // return qres.rowCount;
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
    updatePostModifiedTimestamp: function (id) {
        // const qres = await db.query('UPDATE nn."Post" SET modifytimestamp=now() WHERE id = $1;',[id]);
        // return qres.rowCount;
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
    updatePost: function (category, header, ispublished, description, body, id) {
        //    const qres = await db.query('UPDATE nn."Post" SET category=$1, header=$2, modifytimestamp=now(), ispublished=$3, description=$4, body=$5 WHERE id = $6;',
        //         [category, header, ispublished, description, body, id]);

        //     return qres.rowCount;
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`UPDATE Blog SET category=?1, header=?2, modifytimestamp=?3, ispublished=?4, description=?5, body=?6 WHERE id = ?7;`);
        const result = query.all(category, header, Date.now(), ispublished, description, body, id);
        sqliteDb.close();

        console.log(result);
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
    insertPost: function (header, description, name, category, body) {
        // const qres = await db.query('INSERT INTO nn."Post"(id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) '
        //     + 'VALUES (uuid_generate_v1(), $1, now(), NULL, false, $2, $3, $4, $5);',
        //     [header, description, name, category, body]);

        // return qres.rowCount;
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`INSERT INTO Blog(header, createtimestamp, modifytimestamp, ispublished, description, name, category, body) VALUES (?1, ?2, NULL, false, ?3, ?4, ?5, ?6);`);
        const result = query.all(header, Date.now(), description, name, category, body);
        sqliteDb.close();
        console.log(result);
        return result;
    },
/**
 * 
 * @param {Number} id 
 * @returns 
 */
    getBlogById: function (id) {
        // const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" WHERE id=$1;', [id])
        // return new postClass(qres.rows[0]);
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog WHERE id=?1;`);
        const result = query.all(id);
        sqliteDb.close();

        if(result){
            return result[0];
        }else{
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

        // console.log("result: " + result);

        sqliteDb.close();

        if(result){
            return result[0];
        }else{
            return null;
        }
    },

    getAll: function () {
        // const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category, body FROM nn."Post" ORDER BY createtimestamp DESC;');
        // let data = typeof qres === 'undefined' ? [] : qres.rows, today = new Date(), all = data.map(item => {
        //     return new postClass(item);
        // });
        // return all;
        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT id, header, date(createtimestamp/ 1000, 'unixepoch') as 'createtimestamp',date(modifytimestamp/ 1000, 'unixepoch') as 'modifytimestamp', ispublished, description, name, category, body FROM Blog ORDER BY createtimestamp DESC;`);
        const result = query.all();
        sqliteDb.close();

        return result;
    },

    getAllPublished: function () {
        // const qres = await db.query('SELECT id, header, createtimestamp, modifytimestamp, ispublished, description, name, category FROM nn."Post" WHERE ispublished = true ORDER BY createtimestamp DESC;');
        // let data = typeof qres === 'undefined' ? [] : qres.rows,
        //     today = new Date(),
        //     all = data.map(item => {
        //         return new postClass(item)
        //     });
        // return all;
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

        // console.log("result: " + result);

        sqliteDb.close();

        return result;
    },

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

        // console.log(uniqueYears);
        // console.log(justDates);
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