const del = require('del');
const fs = require('fs');
const path = require('path');

const startDir = process.argv[2];
const resultDir = process.argv[3];
const deleteFlag = process.argv[4] === 'true' ? true : false;

if (!startDir) {
    console.log('Specify the start directory');
    return;
}

if (!resultDir) {
    console.log('Specify the result directory');
    return;
}

const transformFiles = (base, result, deleteFlag) => {
  fs.access(base, (err) => {
    if (err) {
      throw new Error('Ошибка проверки исходной папки');
    }


    fs.access(result, (err) => {
      if (err) {
        fs.mkdir(result, (err) => {
          if (err) {
            throw new Error('Ошибка создания результирующей папки');
          }
        });
      }
    });

    fs.readdir(base, (err, files) => {

      if (err) {
        throw new Error('Ошибка чтения директории');
      }

      files.forEach((item) => {
        let localBase = path.join(base, item);
        fs.stat(localBase, (err, state) => {
          if (err) {
            throw new Error('Ошибка проверки файла');
          }

          if (state.isDirectory()) {
            transformFiles(localBase, result, deleteFlag);
          } else {
            const resultInnerDir =  item[0].toUpperCase();

            fs.access(path.join(resultDir, resultInnerDir), (err) => {
              if (err) {
                fs.mkdir(path.join(resultDir, resultInnerDir), (err) => {
                  if (err) {}
                })
              }

              if (deleteFlag) {
                fs.rename(path.join(base, item), path.join(resultDir, resultInnerDir, item), (err) => {
                  if (err) {
                    fs.copyFile(path.join(base, item), path.join(resultDir, resultInnerDir, item), (err) => {
                      if (err) {
                        throw new Error('Ошибка копирования файла');
                      }

                      fs.unlink(path.join(base, item), (err) => {
                        if (err) {
                          throw new Error('Ошибка удаления файла');
                        }
                      });
                    });
                  }
                });
              } else {
                fs.copyFile(path.join(base, item), path.join(resultDir, resultInnerDir, item), (err) => {
                  if (err) {
                    throw new Error('Ошибка копирования файла');
                  }
                });
              }
            });
          }
        })
      });
    });
  });
}

try {
  transformFiles(startDir, resultDir, deleteFlag);
  if (deleteFlag) {
    del(startDir);
  }
} catch (err) {
  console.error(err);
}

