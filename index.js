const express = require("express");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

// ------------------------------------------------------------

const scraps = [];

// ------------------------------------------------------------

function logRequests(request, response, next){

  const {method, url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
};

// ------------------------------------------------------------

function validateScrapId(request, response, next){

  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: `Param sent is not a valid UUID`});
  };
  next();
};

// ------------------------------------------------------------

function checkEmptyFields(request, response, next){

  const {title, message} = request.body;

  let checkTitle = title == null ? false : title == "" ? false : true;
  let checkMessage = message == null ? false : message == "" ? false : true;

  if(checkTitle == false || checkMessage == false){
    return response.status(400).json({error: `Blank fields!`});
  };
  next();
};

// ------------------------------------------------------------

app.use(logRequests);

// ------------------------------------------------------------

//listar todos os cards
app.get("/scrapbook", (request, response) => {
  const { title } = request.query;

  const card = title ? scraps.filter((scrap) => scrap.title.includes(title)) : scraps;

  return response.json(card);
});

//acrescentar um novo card
app.post("/scrapbook", checkEmptyFields, (request, response) => {

  const {title, message} = request.body;
  const card = {id: uuid(), title, message};

  scraps.push(card);

  return response.json(card);
});

//modificar card de acordo com o id
app.put("/scrapbook/:id", checkEmptyFields, validateScrapId, (request, response) => {
  
  const { id } = request.params;
  const {title, message} = request.body;
  const scrapIndex = scraps.findIndex((scrap) => scrap.id == id);

  if(scrapIndex < 0){
    return response.status(400).json({error:`Scrap nao encontrado! 
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
app.delete("/scrapbook/:id", validateScrapId, (request, response) => {

  const { id } = request.params;
  const scrapIndex = scraps.findIndex((scrap) => scrap.id == id)

  if(scrapIndex < 0){
    return response.status(400).json({"delete error":`Scrap nao encontrado! 
    ==> Id recusado: ${id} <==`});
  };

  scraps.splice(scrapIndex, 1);

  return response.status(204).send();
});

// ------------------------------------------------------------

//a partir daqui deve ser o final do arquivo
const port = 3333;

app.listen(port, () => {
  console.log(`🚀 Back-end started on PORT ${port} 🚀`);
});