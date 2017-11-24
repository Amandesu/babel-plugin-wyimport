
const path = require("path");

const resolveApp = (p) => path.resolve(process.cwd(), p) 




module.exports = {
	build: resolveApp("build"),
	src: resolveApp("src")
}