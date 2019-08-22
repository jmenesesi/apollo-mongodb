let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
let mongoose = require('mongoose');
let UserModel = require('./models/user.model');

mongoose.connect('mongodb://user:password@localhost:27017/data-base?authSource=admin', { useNewUrlParser: true}).then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

const schema = gql`
	input UserInput {
		name: String
		email: String
		password: String
	}
	type User {
		_id: ID!
		name: String!
		email: String!
		password: String!
	}
	type Query {
		users: [User!]
		user(id: ID!): User
	},
	type Mutation {
		addUser(input: UserInput): User
	}
  
`;

const resolvers = {
  Query: {
	user: async (parent, {id}) => {
		return await UserModel.findById(id);
	},
	users: async () => {
		return await UserModel.find({});
	}
  },
  Mutation: {
	  addUser: async (parent, {input})  => {
		  console.log(input);
		  return await UserModel.create(input);
	  }
  }
};


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql', bodyParserConfig: bodyParser.text() });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});