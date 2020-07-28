const express = require("express");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());

const scraps = [];

app.get("/scrapbook", (request, response) => {
  const { title } = request.query;

  const card = title
    ? scrap.filter((project) => project.title.includes(title))
    : scraps;

  return response.json(card);
});

// app.post("/scrapbook", request, response) => {
//     const { title, owner } = request.body
// }

//a partir daqui deve ser o final do arquivo
const port = 3333;

app.listen(port, () => {
  console.log(`🚀Back-end started on PORT ${port}🚀`);
});
