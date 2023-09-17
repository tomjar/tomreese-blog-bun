import figlet from "figlet";

const Utility = {
/**
 * 
 * @param {String} text 
 */
    generateFiglet: function(text){

        figlet(text, function (err, data) {
            if (err) {
              console.log("Something went wrong...");
              console.dir(err);
              return 'Welcome to tomreese.blog!';
            }

            console.log(data);
            return data;
          });
    }
}

export default Utility;