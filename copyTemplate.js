const fs = require("fs-extra");

fs.copy(`${__dirname}/src/templates`, `${__dirname}/build/templates`)
 console.log("🚀 ~ ${__dirname}/src/templates:", ${__dirname}/src/templates)
  console.log("🚀 ~ ${__dirname}/build/templates:", ${__dirname}/build/templates)
  .then(() => {
    console.log("Templates copied successfully!");
  })
  .catch((err) => {
    console.error("Error copying templates:", err);
  });
