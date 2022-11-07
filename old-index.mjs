import {loadStdlib, ask} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const isManufacturer = await ask.ask(
  `Are you Manufacturer?`,
  ask.yesno
)

const who = isManufacturer ? 'Manufacturer' : 'Customer';
console.log(`Starting system as ${who}`);

let acc = null;
const createAcc = await ask.ask(
    `Would you like to create an account?`,
    ask.yesno
);

if(createAcc){
  acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
} else {
  const secret = await ask.ask(
    `What is your account secret?`,
    (x=>x)
  );
  acc = await stdlib.newAccountFromSecret(secret);
}

let ctc = null;
if(isManufacturer){
  ctc = acc.contract(backend);
  ctc.getInfo().then((info) => {
    console.log(`The contract is deployed as = ${JSON.stringify((info))}`);
  });
} else {
  const info = await ask.ask(
    `Please paste the contract information: `,
    JSON.parse
  );
  ctc = acc.contract(backend, info);
}

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async () => fmt(await stdlib.balanceOf(acc));

const before = await getBalance();
console.log(`Your balance is ${before}`);

const interact = { ...stdlib.hasRandom };

interact.informTimeout = () => {
  console.log(`There was a timeout.`);
  process.exit(1);
}

if(isManufacturer){
  const choice = await ask.ask(
    `Do you want to add items?(y/n)`,
    ask.yesno
  )
  if(!choice){
    process.exit(0);
  }
}

interact.setDetails = async() => {
  const brand = await ask.ask(`What is the brand of the product?`, (x) => {
    const brand = x;
    return brand;
  })
  console.log(`The brand of the product is ${brand}.`);

  const id = await ask.ask(`What is the id of the product?`, (x) => {
    const id = x;
    return id;
  })
  console.log(`The id of the product is ${id}.`);
  
  const name = await ask.ask(`What is the name of the product?`, (x) => {
    const name = x;
    return name;
  })
  console.log(`The name of the product is ${name}.`);

  const info = await ask.ask(`What is the info of the product?`, (x) => {
    const info = x;
    return info;
  })
  console.log(`The info of the product is ${info}.`);

  const origin = await ask.ask(`What is the origin of the product?`, (x) => {
    const origin = x;
    return origin;
  })
  console.log(`The origin of the product is ${origin}.`);

  const date = await ask.ask(`What is the manufacture date of the product?`, (x) => {
    const date = x;
    return date;
  })
  console.log(`The manufacture date of the product is ${date}.`);

  const retailer = await ask.ask(`Who is the retailer for the product?`, (x) => {
    const retailer = x;
    return retailer;
  })
  console.log(`The retailer of the product is ${retailer}.`);

  return {brand, id, name, info, origin, date, retailer};
}

interact.getDetails = async(Productinfo) => {
  const {brand, id, name, info, origin, date, retailer} = Productinfo;
  console.log(`Product brand: ${brand}`)
  console.log(`Product id: ${id}`)
  console.log(`Product name: ${name}`)
  console.log(`Product info: ${info}`)
  console.log(`Product origin: ${origin}`)
  console.log(`Product manufacture date: ${date}`)
  console.log(`Product retailer: ${retailer}`)
}

const part = isManufacturer ? ctc.p.Alice : ctc.p.Bob;
await part(interact);

const after = await getBalance();
console.log(`Your balance is now ${after}`)

ask.done;
