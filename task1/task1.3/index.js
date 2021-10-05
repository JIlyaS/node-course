const del = require('del');
const fs = require('fs').promises;
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

const transformFiles = async (base, result, deleteFlag) => {
  try {
    await fs.access(base);
  } catch (err) {
    console.error(err);
    throw new Error('Ошибка проверки исходной папки');
  }

  try {
    await fs.access(result);
  } catch (err) {
    try {
      await fs.mkdir(result);
    } catch (err) {
      console.error(err);
      throw new Error('Ошибка создания результирующей папки');
    }
  }

  try {
    const files = await fs.readdir(base);

    files.forEach(async (item) => {
        let localBase = path.join(base, item);
        try {
          const state = await fs.stat(localBase);

          if (state.isDirectory()) {
            transformFiles(localBase, result, deleteFlag);
          } else {
            const resultInnerDir =  item[0].toUpperCase();

            try {
              await fs.access(path.join(resultDir, resultInnerDir));
            } catch (err) {
              try {
                await fs.mkdir(path.join(resultDir, resultInnerDir));
              } catch (err) {}
            }

            if (deleteFlag) {
              try {
                await fs.rename(path.join(base, item), path.join(resultDir, resultInnerDir, item));
              } catch (err) {
                try {
                  await fs.copyFile(path.join(base, item), path.join(resultDir, resultInnerDir, item));
                } catch (err) {
                  console.error(err);
                  throw new Error('Ошибка копирования файла');
                }

                try {
                  await fs.unlink(path.join(base, item));
                } catch (err) {
                  console.error(err);
                  throw new Error('Ошибка удаления файла');
                }
              }
            } else {
              try {
                await fs.copyFile(path.join(base, item), path.join(resultDir, resultInnerDir, item));
              } catch (err) {
                console.error(err);
                throw new Error('Ошибка копирования файла');
              }
            }
          }
        } catch (err) {
          console.error(err);
          throw new Error('Ошибка проверки файла');
        }
      });
  } catch (err) {
    console.error(err);
    throw new Error('Ошибка чтения директории');
  }
}

try {
  transformFiles(startDir, resultDir, deleteFlag).then(() => {
    console.log('Success');
    if (deleteFlag) {
      del(startDir);
    }
  }, () => {
    console.log('Fail');
  });
} catch (err) {
  console.error(err);
}
