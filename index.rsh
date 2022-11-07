'reach 0.1';

const Product = Object({
  id: Bytes(128),
  brand: Bytes(128),
  info: Bytes(128),
  name: Bytes(128),
  origin: Bytes(128),
  date: Bytes(128),
  retailer: Bytes(128),})

const User = {
  ...hasRandom,
  setDetails: Fun([], Product),
  getDetails: Fun([Product], Null),
}

export const main = Reach.App(() => {
  const Manufacturer = Participant('Alice', {
    ...User,
  });
  const Customer = Participant('Bob', {
    ...User,
  })

  init();

  Manufacturer.only(() => {
    const ProductInfo = declassify(interact.setDetails());
  })
  Manufacturer.publish(ProductInfo)
  commit();

  Customer.only(()=>{
    interact.getDetails(ProductInfo)
  })
  Customer.publish();  
  commit();

  exit();
});
