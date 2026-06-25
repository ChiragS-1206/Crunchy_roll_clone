const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User_Pass1 = require("./database.js")
const mongoose = require("mongoose");
const animeList = require("./animedata2");

// MODERN FFMPEG IMPLEMENTATION (NO DEPRECATED DEPENDENCIES)
const { spawn } = require('child_process');
const fs = require('fs-extra');

// YOUR EXACT FFMPEG PATH (Windows needs double backslashes)
const FFMPEG_PATH = "C:\\Users\\harsh sethi\\Downloads\\ffmpeg-8.0-essentials_build\\ffmpeg-8.0-essentials_build\\bin\\ffmpeg.exe";

const app = express();
const PORT = 5000;
const JWT_SECRET = "your-secret-key-change-in-production";

// CORS CONFIGURATION
app.use(cors({
  credentials: true,
  origin: true // Allow all origins
}));

app.use(express.json()); 
app.use(cookieParser());
app.use("/photos", express.static(path.join(__dirname, "photos")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

// ADD HLS STATIC SERVING
app.use("/hls", express.static(path.join(__dirname, "hls_output"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.m3u8')) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/mp2t');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

mongoose.connect("mongodb://localhost:27017/crunchy_user-pass");

// CREATE HLS OUTPUT DIRECTORY
fs.ensureDirSync(path.join(__dirname, 'hls_output'));

// VERIFY FFMPEG PATH ON STARTUP
console.log('🔍 FFmpeg Path:', FFMPEG_PATH);
if (fs.existsSync(FFMPEG_PATH)) {
  console.log('✅ FFmpeg executable found!');
} else {
  console.log('❌ FFmpeg executable NOT found at specified path!');
  console.log('📂 Please check if the file exists at:', FFMPEG_PATH);
}

// HLS CONVERSION FUNCTION WITH FIXED WINDOWS PATH
const convertToHLS = (inputPath, outputDir, videoId) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, videoId);
    
    try {
      fs.ensureDirSync(outputPath);
      console.log(`📁 Created output directory: ${outputPath}`);
    } catch (error) {
      return reject(new Error(`Failed to create output directory: ${error.message}`));
    }
    
    console.log(`🎬 Starting HLS conversion for: ${videoId}`);
    console.log(`📥 Input: ${inputPath}`);
    console.log(`📤 Output: ${outputPath}`);
    console.log(`🔧 Using FFmpeg: ${FFMPEG_PATH}`);
    
    // Enhanced FFmpeg arguments for HLS conversion
    const ffmpegArgs = [
      '-i', inputPath,
      
      // Global options
      '-preset', 'fast',
      '-g', '48',
      '-keyint_min', '48',
      '-sc_threshold', '0',
      '-threads', '0',
      
      // Video stream mappings for multiple qualities
      '-map', '0:v:0', '-map', '0:a:0',  // 480p
      '-map', '0:v:0', '-map', '0:a:0',  // 720p
      '-map', '0:v:0', '-map', '0:a:0',  // 1080p
      
      // 480p stream settings
      '-c:v:0', 'libx264',
      '-b:v:0', '800k',
      '-maxrate:v:0', '856k',
      '-bufsize:v:0', '1200k',
      '-s:v:0', '854x480',
      '-profile:v:0', 'main',
      '-c:a:0', 'aac',
      '-b:a:0', '96k',
      
      // 720p stream settings  
      '-c:v:1', 'libx264',
      '-b:v:1', '1400k',
      '-maxrate:v:1', '1498k',
      '-bufsize:v:1', '2100k',
      '-s:v:1', '1280x720',
      '-profile:v:1', 'main',
      '-c:a:1', 'aac',
      '-b:a:1', '128k',
      
      // 1080p stream settings
      '-c:v:2', 'libx264',
      '-b:v:2', '2800k',
      '-maxrate:v:2', '2996k',
      '-bufsize:v:2', '4200k',
      '-s:v:2', '1920x1080', 
      '-profile:v:2', 'main',
      '-c:a:2', 'aac',
      '-b:a:2', '128k',
      
      // HLS specific options
      '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2',
      '-master_pl_name', 'master.m3u8',
      '-hls_time', '6',
      '-hls_list_size', '0',
      '-hls_segment_filename', `${outputPath}/%v/segment_%03d.ts`,
      '-hls_flags', 'independent_segments',
      '-f', 'hls',
      `${outputPath}/%v/playlist.m3u8`
    ];
    
    console.log('🚀 Starting FFmpeg process with full Windows path...');
    
    // Spawn FFmpeg process with FULL WINDOWS PATH
    const ffmpegProcess = spawn(FFMPEG_PATH, ffmpegArgs);
    
    let stderrOutput = '';
    let totalDuration = 0;
    
    // Handle FFmpeg stderr (progress info)
    ffmpegProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderrOutput += output;
      
      // Extract total duration
      if (totalDuration === 0) {
        const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        if (durationMatch) {
          const hours = parseInt(durationMatch[1]);
          const minutes = parseInt(durationMatch[2]);
          const seconds = parseFloat(durationMatch[3]);
          totalDuration = hours * 3600 + minutes * 60 + seconds;
          console.log(`⏱️  Total duration: ${totalDuration}s`);
        }
      }
      
      // Extract progress
      const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      const speedMatch = output.match(/speed=\s*(\d+\.?\d*)x/);
      
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const seconds = parseFloat(timeMatch[3]);
        const currentTime = hours * 3600 + minutes * 60 + seconds;
        
        const progress = totalDuration > 0 ? Math.round((currentTime / totalDuration) * 100) : 0;
        const speed = speedMatch ? parseFloat(speedMatch[1]) : 0;
        
        console.log(`⚡ Converting ${videoId}: ${progress}% - Speed: ${speed}x`);
      }
    });
    
    // Handle process completion
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        // Verify output files
        const masterPlaylist = path.join(outputPath, 'master.m3u8');
        const qualityDirs = ['0', '1', '2'];
        
        try {
          if (!fs.existsSync(masterPlaylist)) {
            throw new Error('Master playlist not created');
          }
          
          for (const dir of qualityDirs) {
            const qualityPlaylist = path.join(outputPath, dir, 'playlist.m3u8');
            if (!fs.existsSync(qualityPlaylist)) {
              throw new Error(`Quality playlist ${dir} not created`);
            }
          }
          
          console.log(`✅ HLS conversion completed: ${videoId}`);
          resolve({
            success: true,
            masterPlaylist: `/hls/${videoId}/master.m3u8`,
            qualities: ['480p', '720p', '1080p'],
            videoId: videoId
          });
          
        } catch (verificationError) {
          console.error('❌ Output verification failed:', verificationError.message);
          fs.removeSync(outputPath);
          reject(verificationError);
        }
        
      } else {
        console.error(`❌ FFmpeg failed with code ${code}`);
        console.error('📋 FFmpeg stderr output:', stderrOutput);
        fs.removeSync(outputPath);
        reject(new Error(`FFmpeg conversion failed with code ${code}`));
      }
    });
    
    ffmpegProcess.on('error', (error) => {
      console.error(`❌ FFmpeg process error:`, error.message);
      console.error(`🔍 Tried to execute: ${FFMPEG_PATH}`);
      reject(new Error(`Failed to start FFmpeg: ${error.message}`));
    });
  });
};

// AUTH MIDDLEWARE FOR COOKIES
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// TEST FFMPEG ENDPOINT - UPDATED WITH YOUR PATH
app.get("/test-ffmpeg", (req, res) => {
  console.log('🧪 Testing FFmpeg with your Windows path...');
  console.log('🔍 Path:', FFMPEG_PATH);
  
  // Check if file exists first
  if (!fs.existsSync(FFMPEG_PATH)) {
    return res.json({ 
      success: false, 
      error: 'FFmpeg executable not found at specified path',
      path: FFMPEG_PATH,
      exists: false,
      suggestion: 'Check if the FFmpeg executable exists at the specified path'
    });
  }
  
  const ffmpegTest = spawn(FFMPEG_PATH, ['-version']);
  
  let output = '';
  let errorOutput = '';
  
  ffmpegTest.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  ffmpegTest.stderr.on('data', (data) => {
    output += data.toString(); // FFmpeg version info goes to stderr
  });
  
  ffmpegTest.on('close', (code) => {
    if (code === 0) {
      res.json({ 
        success: true, 
        message: 'FFmpeg is working with full Windows path!',
        path: FFMPEG_PATH,
        version: output.split('\n')[0], // First line has version
        exitCode: code,
        exists: true
      });
    } else {
      res.json({ 
        success: false, 
        error: 'FFmpeg test failed',
        path: FFMPEG_PATH,
        exitCode: code,
        output: output,
        exists: true
      });
    }
  });
  
  ffmpegTest.on('error', (error) => {
    console.error('❌ FFmpeg spawn error:', error.message);
    res.json({ 
      success: false, 
      error: 'Cannot spawn FFmpeg: ' + error.message,
      path: FFMPEG_PATH,
      type: 'spawn_error',
      exists: fs.existsSync(FFMPEG_PATH)
    });
  });
});

// HLS CONVERSION ENDPOINT - UPDATED
app.post("/api/convert-to-hls", async (req, res) => {
  const { videoPath, animeId, episodeNumber } = req.body;
  
  if (!videoPath || !animeId || !episodeNumber) {
    return res.status(400).json({ 
      error: 'Missing required parameters',
      required: ['videoPath', 'animeId', 'episodeNumber']
    });
  }
  
  try {
    const hlsOutput = path.join(__dirname, 'hls_output');
    const videoId = `${animeId}_ep${episodeNumber}`;
    
    console.log(`🚀 HLS conversion request: ${videoId}`);
    console.log(`📹 Video path: ${videoPath}`);
    
    // Check if HLS already exists
    const existingHLS = path.join(hlsOutput, videoId, 'master.m3u8');
    if (fs.existsSync(existingHLS)) {
      console.log(`♻️  HLS already exists: ${videoId}`);
      return res.json({
        success: true,
        hlsUrl: `/hls/${videoId}/master.m3u8`,
        qualities: ['480p', '720p', '1080p'],
        videoId: videoId,
        message: 'HLS stream already available',
        cached: true
      });
    }
    
    // Determine and validate input path
    let fullVideoPath;
    if (videoPath.startsWith('http')) {
      fullVideoPath = videoPath;
      console.log(`🌐 Using remote video: ${fullVideoPath}`);
    } else {
      const cleanPath = videoPath.replace(/^\/videos\//, '').replace(/^videos\//, '');
      fullVideoPath = path.join(__dirname, 'videos', cleanPath);
      
      console.log(`📁 Checking local video: ${fullVideoPath}`);
      
      if (!fs.existsSync(fullVideoPath)) {
        console.error(`❌ Video file not found: ${fullVideoPath}`);
        return res.status(404).json({ 
          error: 'Video file not found',
          requestedPath: videoPath,
          resolvedPath: fullVideoPath 
        });
      }
      
      // Check file size
      const stats = fs.statSync(fullVideoPath);
      console.log(`📊 Video file size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
      
      if (stats.size === 0) {
        return res.status(400).json({ 
          error: 'Video file is empty',
          path: fullVideoPath 
        });
      }
    }
    
    // Test FFmpeg before conversion
    console.log('🔧 Testing FFmpeg before conversion...');
    if (!fs.existsSync(FFMPEG_PATH)) {
      console.error('❌ FFmpeg executable not found:', FFMPEG_PATH);
      return res.status(500).json({
        error: 'FFmpeg executable not found',
        path: FFMPEG_PATH,
        solution: 'Check FFmpeg installation path'
      });
    }
    
    // Convert to HLS
    const result = await convertToHLS(fullVideoPath, hlsOutput, videoId);
    
    console.log(`✅ Conversion successful: ${videoId}`);
    res.json({
      success: true,
      hlsUrl: result.masterPlaylist,
      qualities: result.qualities,
      videoId: result.videoId,
      message: 'HLS conversion completed successfully'
    });
    
  } catch (error) {
    console.error('❌ Conversion error:', error.message);
    console.error('📋 Stack trace:', error.stack);
    
    res.status(500).json({ 
      error: 'Video conversion failed',
      details: error.message,
      videoId: `${animeId}_ep${episodeNumber}`,
      ffmpegPath: FFMPEG_PATH
    });
  }
});

// GET STREAM ENDPOINT
app.get("/api/anime/:animeId/episode/:episodeNumber/stream", (req, res) => {
  const { animeId, episodeNumber } = req.params;
  const videoId = `${animeId}_ep${episodeNumber}`;
  
  const hlsPath = path.join(__dirname, 'hls_output', videoId, 'master.m3u8');
  
  if (fs.existsSync(hlsPath)) {
    res.json({
      hlsUrl: `/hls/${videoId}/master.m3u8`,
      type: 'hls',
      available: true,
      videoId: videoId
    });
  } else {
    const anime = animeList.find(a => a.id.toLowerCase() === animeId.toLowerCase());
    if (anime) {
      const episode = anime.episodes.find(ep => ep.number === parseInt(episodeNumber));
      if (episode && episode.video) {
        res.json({
          originalUrl: episode.video,
          type: 'mp4',
          available: true,
          needsConversion: true,
          animeId: animeId,
          episodeNumber: episodeNumber
        });
        return;
      }
    }
    
    res.status(404).json({ error: 'Stream not found' });
  }
});

// ANIME SEARCH ENDPOINT
app.get("/api/anime/search", (req, res) => {
  const { q: query, limit = 10 } = req.query;
  
  if (!query || query.trim() === '') {
    return res.json({ results: [] });
  }

  try {
    const searchResults = animeList.filter(anime => 
      anime.title?.toLowerCase().includes(query.toLowerCase()) ||
      anime.name?.toLowerCase().includes(query.toLowerCase()) ||
      anime.id?.toLowerCase().includes(query.toLowerCase()) ||
      (anime.genre && anime.genre.some(g => g.toLowerCase().includes(query.toLowerCase())))
    );

    const sortedResults = searchResults.sort((a, b) => {
      const aTitle = (a.title || a.name || '').toLowerCase();
      const bTitle = (b.title || b.name || '').toLowerCase();
      const queryLower = query.toLowerCase();
      
      const aStartsWith = aTitle.startsWith(queryLower) ? 0 : 1;
      const bStartsWith = bTitle.startsWith(queryLower) ? 0 : 1;
      
      if (aStartsWith !== bStartsWith) {
        return aStartsWith - bStartsWith;
      }
      
      return aTitle.length - bTitle.length;
    });

    const limitedResults = sortedResults.slice(0, parseInt(limit));

    res.json({ 
      results: limitedResults,
      count: limitedResults.length,
      total: searchResults.length 
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ALL YOUR EXISTING ENDPOINTS (UNCHANGED)
app.get("/api/anime/:id", (req, res) => {
  const id = req.params.id.toLowerCase();
  console.log("Requested anime ID:", id);
  const anime = animeList.find((a) => a.id.toLowerCase() === id);
  if (anime) {
    res.json(anime);
  } else {
    res.status(404).json({ error: `Anime '${id}' not found` });
  }
});

app.post("/Login", async (req, res) => {
  const { Username, Password } = req.body;
  const user = await User_Pass1.findOne({ username: Username });
  
  if (!user) {
    return res.status(404).send("user not found");
  }
  
  if (user.password !== Password) {
    return res.status(402).send("password incorrect");
  }

  const token = jwt.sign(
    { username: user.username, displayname: user.Displayname, userId: user._id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "login successfully",
    Username: user.username,
    Displayname: user.Displayname,
  });
});

app.post("/Create", async (req, res) => {
  const { Username, Password, Displayname } = req.body;
  
  try {
    const newUser = new User_Pass1({
      username: Username,
      password: Password,
      Displayname: Displayname
    });
    
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { username: savedUser.username, displayname: savedUser.Displayname, userId: savedUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ 
      message: "User created successfully",
      Username: savedUser.username,
      Displayname: savedUser.Displayname
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send("Username already exists");
    }
    res.status(500).send("Server error");
  }
});

app.get("/verify-auth", authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    username: req.user.username,
    displayname: req.user.displayname
  });
});

app.post("/Logout", (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: "Logged out successfully" });
});

app.post("/api/bookmark", authenticateToken, async (req, res) => {
  const { animeId } = req.body;
  const username = req.user.username;
  
  try {
    const result = await User_Pass1.updateOne(
      { username: username },
      { $addToSet: { bookmarks: animeId } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "Bookmark added successfully" });
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/user-bookmarks", authenticateToken, async (req, res) => {
  const username = req.user.username;
  
  try {
    const user = await User_Pass1.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const bookmarkIds = user.bookmarks || [];
    
    const bookmarkedAnime = bookmarkIds.map(id => {
      return animeList.find(anime => anime.id.toLowerCase() === id.toLowerCase());
    }).filter(anime => anime !== undefined);
    
    res.json({ bookmarks: bookmarkedAnime });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/bookmark/remove", authenticateToken, async (req, res) => {
  const Username = req.user.username;
  const { Animeid } = req.body;
  
  try {
    const user = await User_Pass1.findOne({ username: Username });
    if (!user) return res.status(404).send("user not found");
    
    user.bookmarks = user.bookmarks.filter((a) => a !== Animeid);
    await user.save();
    
    res.status(202).send("remove successfully");
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
});

app.post("/api/continue-watching/add", authenticateToken, async (req, res) => {
  const Username = req.user.username;
  const { animeId } = req.body;
  
  try {
    const user = await User_Pass1.findOne({ username: Username });
    if (!user) return res.status(404).send("user not found");
    
    user.continueWatch = user.continueWatch.filter((a) => a !== animeId);
    user.continueWatch.unshift(animeId);
    
    if (user.continueWatch.length > 8) {
      user.continueWatch = user.continueWatch.slice(0, 8);
    }
    
    await user.save();
    res.status(200).json({ message: "Added to continue watching successfully" });
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
});

app.get("/api/continue-watching", authenticateToken, async (req, res) => {
  const username = req.user.username;
  
  try {
    const user = await User_Pass1.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const continueWatchIds = user.continueWatch || [];
    
    const continueWatchingAnime = continueWatchIds.map(id => {
      return animeList.find(anime => anime.id.toLowerCase() === id.toLowerCase());
    }).filter(anime => anime !== undefined);
    
    res.json({ continueWatching: continueWatchingAnime });
  } catch (error) {
    console.error('Get continue watching error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/continue-watching/remove", authenticateToken, async (req, res) => {
  const Username = req.user.username;
  const { Animeid } = req.body;
  
  try {
    const user = await User_Pass1.findOne({ username: Username });
    if (!user) return res.status(404).send("user not found");
    
    user.continueWatch = user.continueWatch.filter((a) => a !== Animeid);
    await user.save();
    
    res.status(202).send("remove successfully");
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Anime Streaming Server Started!`);
  console.log(`📺 Server: http://localhost:${PORT}`);
});
