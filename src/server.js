import env from './config/env.js';
import connectDB from './db.js';
import app from './app.js';

const PORT = env.PORT;

// Connect to Database first, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
  });
});
