const Products = require("../models/ProductModel");
const Categorys = require("../models/CategoryModel");
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");

getallproducts = async (msg, callback) => {
  console.log("Inside getallproducts");
  let res = {};
  Products.find((error, products) => {
    if (error) {
      console.log(error);
      res.status = 500;
      res.data = "Internal Server Error - No products found";
      callback(null, res);
    }
    if (products) {
      res.status = 200;
      res.data = products;
      callback(null, res);
    } else {
      res.status = 200;
      res.data = "No products found";
      callback(null, res);
    }
  });
};

addproduct = async (msg, callback) => {
  console.log("Inside add product");
  let res = {};
  var newProducts = new Products({
    name: msg.body.name,
    price: msg.body.price,
    instock: msg.body.instock,
    category: msg.body.category,
    description: msg.body.description,
    image: msg.body.image,
    shopname: msg.body.shopname,
  });
  Products.findOne(
    { name: msg.body.name, shopname: msg.body.shopname },
    (error, product) => {
      if (error) {
        console.log(error);
        res.status = 500;
        res.data = "Internal Server Error";
        callback(null, res);
      }
      if (product) {
        res.status = 400;
        res.data = "You've already created a product of similar name";
        callback(null, res);
      } else {
        newProducts.save((error, data) => {
          if (error) {
            res.status = 500;
            res.data = "Internal Server Error";
            callback(null, res);
          } else {
            res.status = 200;
            res.data = "Product Added";
            callback(null, res);
          }
        });
      }
    }
  );
};

updateproduct = async (msg, callback) => {
  console.log("Inside update product");
  let res = {};
  Products.findOneAndUpdate(
    { name: msg.body.name },
    {
      price: msg.body.price,
      instock: msg.body.instock,
      category: msg.body.category,
      description: msg.body.description,
      image: msg.body.image,
    }
  )
    .then((product) => {
      if (product) {
        res.status = 200;
        res.data = "Product Updated";
        callback(null, res);
      } else {
        res.status = 400;
        res.data = "Product not found";
        callback(null, res);
      }
    })
    .catch((err) => {
      res.status = 400;
      res.data = "Product not updated due to some error";
      callback(null, res);
    });
};

productdetails = async (msg, callback) => {
  console.log("Inside product details");
  let res = {};
  const id = msg.params.id;
  Products.findOne({ _id: msg.params.id }, (error, product) => {
    if (error) {
      console.log(error);
      res.status = 500;
      res.data = "Internal Server Error - No products found";
      callback(null, res);
    }
    if (product) {
      res.status = 200;
      res.data = product;
      callback(null, res);
    } else {
      res.status = 200;
      res.data = "Cannot find product details";
      callback(null, res);
    }
  });
};

productsbyshopname = async (msg, callback) => {
  console.log("Inside getting products of a shop");
  let res = {};
  Products.find({ shopname: msg.params.shopname })
    .then((products) => {
      if (products) {
        res.status = 200;
        res.data = products;
        callback(null, res);
      } else {
        res.status = 200;
        res.data = "No products found";
        callback(null, res);
      }
    })
    .catch((err) => {
      res.status = 400;
      res.data = "Error in finding products";
      callback(null, res);
    });
};

productdetailsbyname = async (msg, callback) => {
  console.log("Inside product details by product name");
  let res = {};
  Products.findOne({ name: msg.params.name })
    .then((product) => {
      if (product) {
        res.status = 200;
        res.data = product;
        callback(null, res);
      } else {
        res.status = 200;
        res.data = "No product found";
        callback(null, res);
      }
    })
    .catch((err) => {
      res.status = 400;
      res.data = "Error in finding product details";
      callback(null, res);
    });
};

categories = async (msg, callback) => {
  console.log("Inside categories");
  let res = {};
  Categorys.find((error, categories) => {
    if (error) {
      console.log(error);
      res.status = 500;
      res.data = "Internal Server Error - No categories found";
      callback(null, res);
    }
    if (categories) {
      res.status = 200;
      res.data = categories;
      callback(null, res);
    } else {
      res.status = 200;
      res.data = "No categories found";
      callback(null, res);
    }
  });
};

othersellerproducts = async (msg, callback) => {
  console.log("Inside categories");
  let res = {};
  Products.find({ shopname: { $ne: msg.params.shopname } })
    .then((products) => {
      if (products) {
        res.status = 200;
        res.data = products;
        callback(null, res);
      } else {
        res.status = 200;
        res.data = "No products found";
        callback(null, res);
      }
    })
    .catch((err) => {
      res.status = 400;
      res.data = "Error in finding products";
      callback(null, res);
    });
};

search = async (msg, callback) => {
  console.log("Search");
  let res = {};
  console.log(msg.query.name);
  if (msg.query.shopname === "") {
    Products.find({
      name: { $regex: ".*" + msg.query.name + ".*", $options: "i" },
    })
      .then((products) => {
        if (products) {
          res.status = 200;
          res.data = products;
          callback(null, res);
        } else {
          res.status = 200;
          res.data = "No products found";
          callback(null, res);
        }
      })
      .catch((err) => {
        res.status = 400;
        res.data = "Error in finding products";
        callback(null, res);
      });
  } else {
    Products.find({
      name: { $regex: ".*" + msg.query.name + ".*", $options: "i" },
      shopname: { $nin: msg.query.shopname },
    })
      .then((products) => {
        if (products) {
          res.status = 200;
          res.data = products;
          callback(null, res);
        } else {
          res.status = 200;
          res.data = "No products found";
          callback(null, res);
        }
      })
      .catch((err) => {
        res.status = 400;
        res.data = "Error in finding products";
        callback(null, res);
      });
  }
};

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.path === "getallproducts") {
    getallproducts(msg, callback);
  } else if (msg.path === "addproduct") {
    addproduct(msg, callback);
  } else if (msg.path === "updateproduct") {
    updateproduct(msg, callback);
  } else if (msg.path === "productdetails") {
    productdetails(msg, callback);
  } else if (msg.path === "productsbyshopname") {
    productsbyshopname(msg, callback);
  } else if (msg.path === "productdetailsbyname") {
    productdetailsbyname(msg, callback);
  } else if (msg.path === "categories") {
    categories(msg, callback);
  } else if (msg.path === "othersellerproducts") {
    othersellerproducts(msg, callback);
  } else if (msg.path === "search") {
    search(msg, callback);
  }
}

exports.handle_request = handle_request;
