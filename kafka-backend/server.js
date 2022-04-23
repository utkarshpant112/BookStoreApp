var connection = new require("./kafka/Connection");
//topics files
//var signin = require('./services/signin.js');
// var Books = require('./services/books.js');
var Auth = require("./services/auth.js");
var User = require("./services/user.js");
var Product = require("./services/product.js");

const { mongoDB } = require("./config");
const mongoose = require("mongoose");
require("./models/UserModel");
require("./models/ShopModel");
require("./models/ProductModel");
require("./models/CategoryModel");

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxpoolSize: 500,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected`);
  }
});

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("auth", Auth);
handleTopicRequest("user", User);
handleTopicRequest("product", Product);
