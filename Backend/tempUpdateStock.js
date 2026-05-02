import fs from "fs";
const path = "./data/brampton_brick.json";
const data = JSON.parse(fs.readFileSync(path, "utf-8"));

data.forEach((brick) => {
  if (
    brick.dimensions &&
    brick.dimensions.includes('LENGTH 257 MM (10 1/8")') &&
    brick.dimensions.includes('HEIGHT 79 MM (3 1/8")') &&
    brick.dimensions.includes('DEPTH 90 MM (3 1/2")')
  ) {
    brick.stock = "In Stock";
  } else {
    brick.stock = "Made to Order";
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(
  "Updated brampton_brick.json with stock field. Total items:",
  data.length,
);
