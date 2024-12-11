import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth-routes.js';
import { ticketRouter } from './routes/api/ticket-routes.js'; // Import ticket routes
import { authenticateToken } from './middleware/auth.js';
const app = express();
const PORT = process.env.PORT || 3001;
const forceDatabaseRefresh = false; // Set this to true if you want to force a database refresh
// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));
app.use(express.json());
app.use(bodyParser.json());
// Use auth routes
app.use('/api/auth', authRoutes);
// Use ticket routes
app.use('/api/tickets', authenticateToken, ticketRouter);
// Add routes that require authentication here
app.get('/api/protected', authenticateToken, (_req, res) => {
    res.json({ message: "This is a protected route." });
});
sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});
