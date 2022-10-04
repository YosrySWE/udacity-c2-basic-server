import express, { Router, Request, Response } from "express";
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require("body-parser");

import { Car, cars as cars_list } from "./cars";

(async () => {
  let cars: Car[] = cars_list;

  //Create an express application
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true })); //for requests from forms-like data

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name", (req: Request, res: Response) => {
    let { name } = req.params;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post("/persons", async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater

  app.get("/cars/", async (req: Request, res: Response) => {
    let make = req.query.make;
    let cars_list: Car[] = cars;
    if (make) {
      cars_list = cars.filter((car) => car.make === make);
    }

    return res.status(200).json(cars_list);
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", (req: Request, res: Response) => {
    // destruct our path params
    let { id } = req.params;

    // check to make sure the id is set
    if (!id) {
      // respond with an error if not
      return res.status(400).send(`id is required`);
    }

    // try to find the car by id
    const car = cars.find((car) => car.id == parseInt(id));

    // respond not found, if we do not have this id
    if (!car) {
      return res.status(404).send(`car is not found`);
    }

    //return the car with a success status code
    res.status(200).send(car);
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost

  app.post("/cars", (req: Request, res: Response) => {
    const body = req.body;
    const { id, type, model, cost } = body;
    // check to make sure the id is set
    if (!id) {
      // respond with an error if not
      return res.status(400).send(`id is required`);
    }
    // check to make sure the type is set
    if (!type) {
      // respond with an error if not
      return res.status(400).send(`type is required`);
    }
    // check to make sure the model is set
    if (!model) {
      // respond with an error if not
      return res.status(400).send(`model is required`);
    }
    // check to make sure the cost is set
    if (!cost) {
      // respond with an error if not
      return res.status(400).send(`cost is required`);
    }
    // check to make sure the body is set
    if (!body) {
      return res.status(400).send(`You must enter body of inserted car`);
    }

    const duplicate = cars.filter((c) => c.id === id);
    if (duplicate && duplicate.length > 0) {
      return res.status(409).send("This car already exists");
    } else {
      cars.push(body);
      return res.status(201).send(body);
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
