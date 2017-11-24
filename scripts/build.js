
const webpack = require('webpack');
const path = require('path');
const config = require('../config/webpack.prod.config');
const chalk = require('chalk');
const paths = require('../config/paths');
const fs = require("fs");

// 获取目录大小
const getDirSize = (rootPath, unit ="k") => {
	if (!fs.existsSync(rootPath)) {
		return 0;
	}
	let buildSize = 0;
	const dirSize = (dirPath) => {
		let files = fs.readdirSync(dirPath, "utf-8")
		files.forEach((files) => {
			let filePath = path.resolve(dirPath, files);
			let stat = fs.statSync(filePath) || [];
			if (stat.isDirectory()){
				dirSize(filePath)
			} else {
				buildSize += stat.size
			}
		})
	}
	dirSize(rootPath)
	let map = new Map([["k",(buildSize/1024).toFixed(2)+"k"], ["M",buildSize/1024/1024+"M"]])
	return map.get(unit);
}
// 清空目录文件
const rmDir = (path, isDeleteDir) => {
	if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                rmDir(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

const measureFileBeforeBuild = () => {
	console.log(`打包之前build文件夹的大小: ${chalk.green(getDirSize(paths.build))}\n`)
	rmDir(paths.build)  //删除build文件夹
	return build().then((stats) => {
		console.log(chalk.green(`打包完成\n`))
		console.log(`打包之后文件夹大小:${chalk.green(getDirSize(paths.build))}\t花费时间: ${chalk.green((stats.endTime-stats.startTime)/1000)}s`)
	}, err => {
		console.log(chalk.red('Failed to compile.\n'));
      	console.log((err.message || err) + '\n');
      	process.exit(1);
	})
}

const build = () => {
	const compiler = webpack(config)
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			console.log(chalk.green("开始打包..."))
			if (err) {
				return reject(err);
			}
			const message = stats.toJson({}, true)
			if (message.errors.length) {
				return reject(message.errors);
			}
			return resolve(stats)
		})
	})
}
measureFileBeforeBuild()


