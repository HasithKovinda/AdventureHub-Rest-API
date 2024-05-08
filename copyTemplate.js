const fs = require("fs-extra");

fs.copy("./src/templates", "./build/templates")
  .then(() => {
    console.log("Templates copied successfully!");
  })
  .catch((err) => {
    console.error("Error copying templates:", err);
  });
