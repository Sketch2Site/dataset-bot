const fs = require("fs");

const transformJSONtoCSV = async (path) => {
  const rawData = await fs.readFileSync(`./storage/${path}.json`);
  const parsedData = JSON.parse(rawData);

  let linesToWrite = '"image","xmin","ymin","xmax","ymax","label"\n';

  parsedData.forEach((data) => {
    linesToWrite += `"${data.path}", ${data.xMin}, ${data.yMin}, ${data.xMax}, ${data.yMax}, "${data.label}" \n`;
  });

  fs.writeFile(`./storage/${path}.csv`, linesToWrite, () => {
    console.log(`transformed entries for ${path}`);
  });
  console.log(linesToWrite.length);
};

transformJSONtoCSV("paragraph/paragraph");
