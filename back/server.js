require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./modules/database.js');
const usersRoutes = require('./routes/users.js');
const caresRoutes = require('./routes/cares.js');
const appointmentsRoutes = require('./routes/appointments.js');
const eventsRoutes = require('./routes/events.js');
const guestbookRoutes = require('./routes/guestbook.js');
const helmet = require('helmet');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173'
}))
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API quiz',
            version: '0.0.1',
            description: '',
            contact: {
                name: 'Jean-Baptiste, Jonathan'
            },
        },
        servers: [{url: 'http://localhost:3000/api'}]
    },
    apis: ['./routes/*js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(
    session({
    secret: "devSecretKey",
    name: "SESSID",
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: true },
    })
   );   
app.use('/api/users', usersRoutes);
app.use('/api/cares', caresRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/guestbook', guestbookRoutes);

db.connect((err) => {
    if (err) {console.log(err);}
    else {console.log('connecté à la base de données');}
});

const port = process.env.PORT || 3333;
app.listen(port, () => {console.log('SERVEUR DEMMARÉ');});