const assert = require("assert");
const { get } = require("./index");
const axios = require("axios");

describe("POST users LOGIN API call", () => {
  const data = {
    email: "testuser@gmail.com",
    password: "Sjsu@123",
  };
  it("should return user details(for storing in redux) when the user logs in", async () => {
    const response = await axios.post("http://localhost:5000/login", data);
    console.log(response);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data[0].name, "John Doe");
    assert.strictEqual(response.data[0].email, "testuser@gmail.com");
  });
});

describe("POST users SHOPNAMEAVAILABLE API call", () => {
  const data = {
    shopname: "JohnDoeShop",
  };
  it("should return 400 status as the shop already exists for user John Doe", async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/shopNameAvailable",
        data
      );
    } catch (err) {
      assert.strictEqual(err.response.status, 400);
      assert.strictEqual(err.response.data, "Shop name is not available.");
    }
  });
});

describe("GET ISSHOPALREADYCREATED user API call", () => {
  const data = {
    email: "testuser@gmail.com",
  };
  it("should return 200 status as there is a shop for user John Doe", async () => {
    const response = await axios.post(
      "http://localhost:5000/isshopalreadycreated",
      data
    );
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data, "JohnDoeShop");
  });
});

describe("GET CATEGORIES API call", () => {
  const options = [
    { value: "Art", label: "Art" },
    { value: "Clothing", label: "Clothing" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Home Decor", label: "Home Decor" },
    { value: "Jewellery", label: "Jewellery" },
    { value: "Others", label: "Others" },
  ];
  it("should return 200 status and the list of categories", async () => {
    const response = await axios.get("http://localhost:5000/categories");
    console.log(response.data);
    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.data, options);
  });
});

describe("GET PRODUCTS OF A SHOPNAME API call", () => {
  const shopname = "JohnDoeShop";
  it("It should return 0 products as there are no products added to this shop.", async () => {
    const response = await axios.get(
      "http://localhost:5000/products/" + shopname
    );
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.length, 0);
  });
});
