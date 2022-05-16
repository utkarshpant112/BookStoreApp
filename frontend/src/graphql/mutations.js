export const loginMutation = `
  mutation login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`;

export const signUpMutation = `
  mutation add($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      token
  }
`;

export const updateUserMutation = `
mutation update($name:String,$email:String,$phone:String,
  $dob:String,$about:String,$pic:String,$address:String,$city:String,$country:String){
    updateUser(
    name:$name,
    email:$email,
    phone:$phone,
    gender:$gender,
    dob:$dob,
    about:$about,
    pic:$pic,
    address: $address,
    city:$city,
    country:$country,
    )
}`;

export const createShopMutation = `mutation create($shopName:String!,$email:String!) {
  createShop(
      shopname:$shopName,
      email:$email,
  )
  {
    shopname,
    email
  }
}`;

export const addProductMutation = `
  mutation addProd($name: String!, $price: Float!,$instock: Int!,$category: String!,$description : String!, $image: String!, $shopname:String!) {
    addProduct(name: $name, price: $price,instock: $instock,category: $category,description : $description, image: $image, shopname:$shopname) {
      result
    }
  }
`;

export const updateProductMutation = `
  mutation updateProd($name: String!, $price: Float!,$instock: Int!,$category: String!,$description : String!, $image: String!, $shopname:String!) {
    updateProduct(name: $name, price: $price,instock: $instock,category: $category,description : $description, image: $image, shopname:$shopname) {
      result
    }
  }
`;

export const createOrder = `
  mutation createOrd($name: String!, $price: Float!,$quantity: Int!,$isgiftwrapped:String,$dateofpurchase: String!,$description : String!, $image: String!, $shopname:String!,$currency:String!) {
    createOrder(name: $name, price: $price,quantity: $quantity,isgiftwrapped:$isgiftwrapped,dateofpurchase:$dateofpurchase,category: $category,description : $description, image: $image, shopname:$shopname,currency:$currency) {
      result
    }
  }
`;
