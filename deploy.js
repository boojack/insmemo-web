var ghpages = require("gh-pages");
var path = require("path");

ghpages.publish(path.join(__dirname, "dist"), (err) => {
  if (err) {
    console.err(err);
  } else {
    console.log("deploy to github page succeed!");
  }
});
