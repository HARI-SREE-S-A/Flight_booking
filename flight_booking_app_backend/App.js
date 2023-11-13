import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Amadeus from 'amadeus';

const amadeus = new Amadeus({
    clientId: 'UL8vX5X5tceUU7sxYiivjpiYq6qU3OSn',
    clientSecret: 'HWGyklXZZVFG708zz',
});

// API credentials for flight search
const flightSearchAmadeus = new Amadeus({
    clientId: 'rnHDTykqN5mjkuPsO50wCHDFJFIoph0X',
    clientSecret: 'J6rnDWhobX4b3mU5'
})

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// City and Airport Search
app.get(`/city-and-airport-search/:parameter`, (req, res) => {
    const parameter = req.params.parameter;
    // Which cities or airports start with the parameter variable
    amadeus.referenceData.locations
        .get({
            keyword: parameter,
            subType: Amadeus.location.any,
        })
        .then(function (response) {
            res.send(response.result);
        })
        .catch(function (response) {
            res.send(response);
        });
});

app.get(`/flight-search`, (req, res) => {
    const originCode = req.query.originCode;
    const destinationCode = req.query.destinationCode;
    const dateOfDeparture = req.query.dateOfDeparture;
    
    // Find the cheapest flights
    flightSearchAmadeus.shopping.flightOffersSearch
        .get({
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: dateOfDeparture,
            adults: '1',
            max: '7',
        })
        .then(function (response) {
            res.send(response.result);
        })
        .catch(function (response) {
            res.send(response);
        });
});

app.listen(PORT, () =>
    console.log(`Server is running on port: http://localhost:${PORT}`)
);
