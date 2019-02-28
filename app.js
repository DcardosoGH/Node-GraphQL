const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();

const events = [];

app.use(bodyParser.json());


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: ()=> {
            return events;
        },
        createEvent: (args)=> {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));


mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:
    toor
    @cluster0-lmw36.mongodb.net/test?retryWrites=true`
    ).then(() => {
        app.listen(PORT);       
    })
    .catch((err)=> {
        console.log(err);
    });