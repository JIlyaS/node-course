const fs = require('fs');
const path = require('path');

const startDir = process.argv[2];
const resultDir = process.argv[3];
const level = +process.argv[4] || 3;
const isDeletedStartDir = process.argv[5] === 'delete' ? true : false;

if (!startDir) {
    console.log('Specify the start directory');
    return;
}

if (!resultDir) {
    console.log('Specify the result directory');
    return;
}

const readDir = (base, currentLevel) => {
    if (currentLevel <= 0) {
      return;
    }
    const files = fs.readdirSync(base);
    files.forEach((item) => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      if (state.isDirectory()) {
        readDir(localBase, currentLevel - 1);
      } else {
        if ( !fs.existsSync(resultDir) ) {
          fs.mkdirSync(resultDir)
        }

        const innerDir =  item[0].toUpperCase();

        if ( !fs.existsSync(path.join(resultDir, innerDir)) ) {
          fs.mkdirSync(path.join(resultDir, innerDir))
        }

        if ( !fs.existsSync(path.join(resultDir, innerDir, item)) ) {
            fs.linkSync(path.join(base, item), path.join(resultDir, innerDir, item));
        }

        if (isDeletedStartDir) {
            fs.unlinkSync(path.join(base, item));

            if (fs.readdirSync(base).length === 0) {
                fs.rmdirSync(base);
            }

            if (fs.readdirSync(startDir).length === 0) {
                fs.rmdirSync(startDir);
            }
        }
      }
    });
}

readDir(startDir, level);

// const path = require('path');
// const util = require('util');
// const fs = require('fs');

// const readdir = util.promisify(fs.readdir);

// const config = {
//     typeDirs: [
//         { type: '.pdf', directory: 'documents' },
//         { type: '.png', directory: 'images' },
//         { type: '.mp3', directory: 'music' },
//     ]
// }

// const directory = process.argv[2];

// if (!directory) {
//     console.log('Specify the target directory');
//     return;
// }

// [...config.typeDirs, { directory: 'other' }].map((dir) => {
//   const dirname = `${directory}/${d.directory}`;
//   if ( !fs.exists(directory) ) {
//     fs.mkdirSync(dirname)
//   }
// });

// (async () => {
//   const files = await readdir(directory);
//   files.forEach((file) => {
//     const extname = path.extname(file);
//     if (!extname) {
//       return;
//     }

//     const { directory: targetDir = 'other' } = config.typeDirs.find((dir) => dir.type === extname) || {};

//     const oldPath = path.join(__dirname, directory, file);
//     const newPath = path.join(__dirname, directory, targetDir, file);

//     fs.rename(oldPath, newPath, (err) => {
//       if (err) {
//         throw err;
//       }
//     });
//   });
// })();
