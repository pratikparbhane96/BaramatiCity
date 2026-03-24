const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const DATA_PATH = path.join(__dirname, 'data', 'gallery_posts.json');

// API: Get all gallery posts
app.get('/api/posts', (req, res) => {
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read gallery data' });
        }
        res.json(JSON.parse(data));
    });
});

// API: Upload a new post
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { author, location, caption, type } = req.body;
    
    // Read existing data
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update gallery data' });
        }

        const galleryData = JSON.parse(data);
        const newPost = {
            id: Date.now(),
            type: type || (req.file.mimetype.startsWith('video/') ? 'video' : 'image'),
            src: 'uploads/' + req.file.filename,
            author: author || 'Community Member',
            location: location || 'Baramati, Maharashtra',
            caption: caption || 'New shared moment!',
            date: 'Just now',
            likes: 0,
            comments: 0
        };

        galleryData.posts.push(newPost);

        // Save updated data
        fs.writeFile(DATA_PATH, JSON.stringify(galleryData, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save gallery data' });
            }
            res.json({ message: 'Post uploaded successfully!', post: newPost });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Baramati Tourism Server running at http://localhost:${PORT}`);
});
