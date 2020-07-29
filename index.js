const express = require("express");

const { uuid } = require("uuidv4");
const { response, request } = require("express");

const app = express();

app.use(express.json());

const scraps = [
  //{id:"1", titulo: "Titulo fixo 01", mensagem:"Mensagem fixa 01"},
];

//listar todos os cards
app.get("/scrapbook", (request, response) => {
  //const { title } = request.query;

  //const card = title ? scrap.filter((project) => project.title.includes(title)) : scraps;

  return response.json(scraps);
});

//acrescentar um novo card
app.post("/scrapbook", (request, response) => {

  const {title, message} = request.body;
  const card = {id: String("POST-AQUI-"+uuid()), title, message};

  scraps.push(card);

  return response.json(card);
});

//modificar card de acordo com o id
app.put("/scrapbook/:id", (request, response) => {
  
  const { id } = request.params;
  const {title, message} = request.body;
  const scrapIndex = scraps.findIndex((scrap) => scrap.id == id);

  if(scrapIndex < 0){
    return response.status(400).json({"update error":`Scrap nao encontrado! 
    ==> Id recusado: ${id} <==`})
  };

  const card = {
    id,
    title,
    message,
  };

  scraps[scrapIndex] = card;

  return response.json(card);
});

//deletar card de acordo com o id
app.delete("/scrapbook/:id", (request, response) => {

  const { id } = request.params;
  const scrapIndex = scraps.findIndex((scrap) => scrap.id == id)

  if(scrapIndex < 0){
    return response.status(400).json({"delete error":`Scrap nao encontrado! 
    ==> Id recusado: ${id} <==`});
  };

  scraps.splice(scrapIndex, 1);

  return response.status(204).send();
});

// ------------------------------------------
//a partir daqui deve ser o final do arquivo
const port = 3333;

app.listen(port, () => {
  console.log(`🚀 Back-end started on PORT ${port} 🚀`);
});
