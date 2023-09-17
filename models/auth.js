import { Database } from "bun:sqlite";

const Auth = {

/**
 * 
 * @param {String} username 
 * @param {String} password 
 * @param {String} cfpassword 
 */
    initPassword: async function(username, password, cfpassword){

        if(password === cfpassword){

            const sqliteDb = new Database("tomreeseblog.sqlite");
            const query = sqliteDb.query(`UPDATE Sspw SET pw=?1, salt=?2 WHERE username = ?3;`);
    
            const salt = Bun.hash(Date.now());

            const pwPlusSalt = password + salt;

            const hash = await Bun.password.hash(pwPlusSalt, {
                algorithm: "argon2d", // "argon2id" | "argon2i" | "argon2d"
                memoryCost: 4, // memory usage in kibibytes
                timeCost: 3, // the number of iterations
            });

            const result = query.all(hash, salt, username);
            sqliteDb.close();
            return result;
            
        }

        return null;
    },

    /**
     * @description validates the super secret password
     * @param {String} username the user
     * @param {String} password the attempted password
     */
    validatePassword: async function (username, password) {

        const sqliteDb = new Database("tomreeseblog.sqlite");
        const query = sqliteDb.query(`SELECT * FROM Sspw WHERE username = ?1 LIMIT 1;`);
        const result = query.all(username);

        // console.log("result: " + result);

        sqliteDb.close();

        if (result) {
            const data = result[0];
            const hashedUserPw = data.pw;
            const salt = data.salt;
            const pwPlusSalt = password + salt;

            console.log('given pw: ' + password);
            console.log('db salt:' + salt);
            console.log('pwplsusal: ' + pwPlusSalt);

            if(!hashedUserPw && !salt){
                    return {
                        valid: false,
                        setpassword: true
                    };
                
            }else{
                const hash = await Bun.password.hash(pwPlusSalt, {
                    algorithm: "argon2d", // "argon2id" | "argon2i" | "argon2d"
                    memoryCost: 4, // memory usage in kibibytes
                    timeCost: 3, // the number of iterations
                });
    
                const valid = await Bun.password.verify(hashedUserPw, hash);

                console.log('db:' + hashedUserPw);
                console.log('given:' +  hash);
    
                return {
                    valid: valid,
                    setpassword: false
                };
            }

        } else {
            return {
                valid: false,
                setpassword: false
            };
        }

    }
};

export default Auth;