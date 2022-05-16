export const getUserById = `
    query getUserById($userId: String!) {
        getUserById(userId: $userId) {
        _id
        name
        email
        pic
        dob
        address 
        city
        country
        about
        phone
    }
  }
`;

export const getShopAvailability = `query($shopName:String!){
    getShopAvailability(shopName:$shopName)
    {
        result
    }
}`;

export const getShopByUserId = `
    query getShopByUserId($ownerId: String!) {
        getShopByUserId(ownerId: $ownerId) {
         _id
        shopname
        ownerId
        shopimage
    }
  }
`;

export const getShopByShopId = `
    query getShopByShopId($shopId: String!) {
        getShopByShopId(shopId: $shopId) {
         _id
        shopname
        ownerId
        shopimage
    }
  }
`;

export const getOrdersByCustomerId = `
    query getOrdersByCustomerId($userId: String!) {
        getOrdersByCustomerId(userId: $userId) {
         Order {
         {
            _id
            name
            price
            quantity
            dateofpurchase
            customerId
            currency
            shopname
            isgiftwrapped
            description
            image
        } 
    }
    }
  }
`;

export const getOtherProductsByuserId = `
    query getOtherProductsByuserId($userId: String!) {
        getOtherProductsByuserId(userId: $userId) {
         Products{
             {
            _id
            name
            price:
            instock
            category
            description
            shopname
            image
            totalsales
            token
        } 
    }
    }
  }
`;

export const getProductByProductId = `
    query getProductByProductId($productId: productId!) {
        getProductByProductId(productId: $productId) {
         {
            _id
            name
            price
            quantity
            dateofpurchase
            customerId
            currency
            shopname
            isgiftwrapped
            description
            image
        } 
    }
  }
`;

export const getProducts = `
   query {
        products{
            _id
            name
            price:
            instock
            category
            description
            shopname
            image
            totalsales
            token
        }
    }
`;

export const getCategories = `
   query {
        categories{
            _id
            value
            label
        }
    }
`;
