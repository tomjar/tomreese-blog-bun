import { Database } from "bun:sqlite";

const Auth = {

    /**
     * @description validates the super secret password
     * @param {String} username the user
     * @param {String} password the attempted password
     */
    validatePassword: async function (username, password) {

        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT * FROM Sspw WHERE username = ?1;`);
        const result = query.all(username);

        // console.log("result: " + result);

        sqliteDb.close();

        if (result) {

            const data = result[0];
            const hashedUserPw = data.pw;
            const pwPlusSalt = password + data.salt;

            const hash = await Bun.password.hash(pwPlusSalt, {
                memoryCost: 4, // memory usage in kibibytes
                timeCost: 3, // the number of iterations
              });

            const valid = await Bun.password.verify(hashedUserPw, hash);

            return valid;
        } else {
            return false;
        }

    }
};

export default Auth;