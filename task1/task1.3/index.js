const fsPromises = require('fs').promises;
const fs = require('fs');
const del = require('del');
const path = require('path');

const startDir = process.argv[2];
const resultDir = process.argv[3];
const level = +process.argv[4] || 3;
const isDeleteStartDir = process.argv[5] === 'true' ? true : false;

if (!startDir) {
    console.log('Specify the start directory');
    return;
}

if (!resultDir) {
    console.log('Specify the result directory');
    return;
}

const transformFiles = (base, result, currentLevel, isDelete) => {
  return new Promise(async (resolve, reject) => {
    if (currentLevel === 0) {
      resolve();
      return;
    }
    try {
      const files = await fsPromises.readdir(base);

      files.forEach(async (item) => {
        let localBase = path.join(base, item);
        let state = await fsPromises.stat(localBase);
        if (state.isDirectory()) {
          await transformFiles(localBase, result, currentLevel - 1, isDelete);
        } else {

          if ( !fs.existsSync(result) ) {
            await fsPromises.mkdir(result)
          }

          const innerDir =  item[0].toUpperCase();

          if ( !fs.existsSync(path.join(result, innerDir)) ) {
            await fsPromises.mkdir(path.join(result, innerDir))
          }

          if ( !fs.existsSync(path.join(result, innerDir, item)) ) {
            await fsPromises.link(path.join(base, item), path.join(resultDir, innerDir, item));
          }

          // if (isDelete) {
          //   await fsPromises.unlink(path.join(base, item));

          //   const countBaseDir = fs.readdirSync(base).length;
          //   const countStartDir = fs.readdirSync(startDir).length;

          //   if (countBaseDir === 0) {
          //     await fsPromises.rmdir(base);
          //   }

          //   if (countStartDir === 0) {
          //     await fsPromises.rmdir(startDir);
          //   }
          // }

              if (--currentLevel === 0) {
                if (isDelete) {
                  del.sync([startDir]);
                }
                resolve();
                return;
              }
        }
      });
    } catch (err) {
      console.error(err);
      return;
    }
  });
}

transformFiles(startDir, resultDir, level, isDeleteStartDir).then(() => {
		console.log('Success');
}, () => {
  console.log('Fail');
});
