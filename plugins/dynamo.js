"use strict";

const kuuid = require("kuuid");
const fp = require("fastify-plugin");
const {
  DynamoDBClient,
  CreateTableCommand,
  QueryCommand,
} = require("@aws-sdk/client-dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const fastify = require("fastify");


// const client = new DynamoDBClient({
//   region: "us-west-2",
//   credentials: {
//     accessKeyId: "fastify.config.AWS_ACCESS_KEY",
//     secretAccessKey: fastify.config.AWS_SECRET_ACCESS,
//   },
// });

const clientObject = (fastify) => {
  return new DynamoDBClient({
    region: "us-west-2",
    credentials :{
      accessKeyId : fastify.config.AWS_ACCESS_KEY,
      secretAccessKey: fastify.config.AWS_SECRET_ACCESS
    }
  })
}

const createTable = async (fastify,tableSchema) => {
  let client = clientObject(fastify);
  let result = await client.send(new CreateTableCommand(tableSchema));
  if (result.TableDescription != undefined) {
    return { success: true, message: "Table created successfully." };
  } else {
    return {
      success: false,
      message: "Error in creating table. Please visit log for errors.",
    };
  }
};
const putIntoDynamo = async (fastify,params) => {
  let client = clientObject(fastify);
  if (params.id == undefined) {
    let id = kuuid.id();
    params.Item.id = id;
  }
  await client.send(new PutCommand(params));
};

const validateBearer = async (fastify,query) => {
  let client = clientObject(fastify);
  let result = await client.send(new QueryCommand(query));
  if (result.Items.length == 0) {
    return { success: false, message: "User not present." };
  } else {
    return { success: true, Items: result.Items };
  }
};
const scanDb = async (fastify,query) => {
  let client = clientObject(fastify);
  let result = await client.send(new ScanCommand(query));
  if (result.Items.length == 0) {
    return { success: false, message: "User not present." };
  } else {
    return { success: true, Items: result.Items };
  }
};
const findUserByEmail = async (fastify,email) => {
  let client = clientObject(fastify);
  const query = {
    TableName: "user_details",
    FilterExpression: "email = :e ",
    ExpressionAttributeValues: {
      ":e": email,
    },
  };
  let result = await client.send(new ScanCommand(query));
  if (result.Items.length == 0) {
    return { success: false, message: "user not present." };
  } else {
    return { success: true, message: "user present", data: result.Items };
  }
};
module.exports = fp(async function (fastify, opts) {
  // fastify.decorate("client", client);
  fastify.decorate("createTable", createTable);
  fastify.decorate("insert", putIntoDynamo);
  fastify.decorate("validateBearer", validateBearer);
  fastify.decorate("scanDb", scanDb);
  fastify.decorate("findUserByEmail", findUserByEmail);
});

const tableSchema = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "N",
    },
    {
      AttributeName: "user_role",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
    {
      AttributeName: "user_role",
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
  TableName: "user_details_2",
};
