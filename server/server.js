import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import db from './models/db.js';
import { supabase } from './supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist'))); 

// Routes
app.use('/api', apiRoutes);


app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

setInterval(() => {
    const now = new Date().toISOString();
    
    // 1. Find all expired files
    db.all(`SELECT * FROM uploads WHERE expiresAt < ?`, [now], async (err, rows) => {
        if (err) {
            console.error("Cleanup Error:", err);
            return;
        }

        if (rows.length > 0) {
            console.log(` Found ${rows.length} expired items. Cleaning up...`);

            for (const row of rows) {
                // 2. If it is a FILE, delete it from Supabase Cloud Storage
                if (row.type === 'file') {
                    const { error } = await supabase
                        .storage
                        .from('uploads')
                        .remove([row.content]); 

                    if (error) {
                        console.error(` Failed to delete ${row.content} from Supabase:`, error.message);
                    } else {
                        console.log(` Deleted file from Supabase: ${row.content}`);
                    }
                }

                // 3. Delete the record from SQLite Database
                db.run(`DELETE FROM uploads WHERE id = ?`, [row.id], (err) => {
                    if (err) console.error("DB Delete Error:", err);
                    else console.log(` Deleted database record: ${row.id}`);
                });
            }
        }
    });
}, 5* 60 * 1000); 

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});