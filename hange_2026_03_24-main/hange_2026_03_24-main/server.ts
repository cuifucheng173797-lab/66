import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import OpenAI from "openai";
import multer from "multer";
import db, { initDB } from "./server/db";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  initDB();

  // Middleware for parsing JSON
  app.use(express.json());
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadDir));

  // --- API Routes (Mock Backend for Alibaba Cloud integration) ---
  
  // DashScope (Qwen) Proxy
  app.post("/api/ai/generate", async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.DASHSCOPE_API_KEY;

    if (!apiKey) {
      // Return a mock response if API key is missing
      console.log("DASHSCOPE_API_KEY is missing, returning mock response.");
      return res.json({ 
        text: `### 战略决策报告 (模拟数据)\n\n**执行摘要**\n针对您提出的“${prompt}”，我们进行了深度分析。目前行业处于快速变革期，数字化转型是核心驱动力。\n\n**关键发现**\n1. 市场需求持续增长，尤其是在智能集成领域。\n2. 政策导向明确，支持绿色低碳与技术创新。\n3. 竞争格局正在重塑，头部效应明显。\n\n**战略建议**\n- 加大研发投入，提升核心竞争力。\n- 优化供应链管理，降低运营风险。\n- 积极拓展国际市场，寻找新的增长点。` 
      });
    }

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      });

      const completion = await openai.chat.completions.create({
        model: "qwen-max",
        messages: [
          { role: "system", content: "你是一名资深行业分析师。" },
          { role: "user", content: prompt },
        ],
      });

      res.json({ text: completion.choices[0].message.content });
    } catch (error) {
      console.error("DashScope Error:", error);
      res.status(500).json({ error: "Failed to generate content from Qwen." });
    }
  });

  // Example: Get all enterprises (Super Admin only)
  app.get("/api/enterprises", (req, res) => {
    setTimeout(() => {
      res.json([
        { id: "ent_001", name: "光辉会展服务有限公司", users: 12, storageUsed: "45.2 GB", status: "Active" },
        { id: "ent_002", name: "星辰公关策划", users: 5, storageUsed: "12.8 GB", status: "Active" },
        { id: "ent_003", name: "未来科技展览", users: 2, storageUsed: "1.2 GB", status: "Suspended" },
      ]);
    }, 1500); // 1.5s delay to show skeleton loading
  });

  // Example: Get projects for a specific enterprise (Data Isolation)
  app.get("/api/projects", (req, res) => {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      return res.status(401).json({ error: "Missing tenant ID" });
    }
    // Here we would query Alibaba Cloud RDS: SELECT * FROM projects WHERE enterprise_id = ?
    res.json({ status: "ok", message: `Fetched projects for tenant ${tenantId}` });
  });

  // --- Categories API ---
  app.get("/api/categories", (req, res) => {
    const { type } = req.query;
    try {
      const stmt = db.prepare("SELECT * FROM categories WHERE type = ?");
      const categories = stmt.all(type || 'asset');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", (req, res) => {
    const { name, type } = req.body;
    try {
      const id = `cat_${Date.now()}`;
      const stmt = db.prepare("INSERT INTO categories (id, name, type) VALUES (?, ?, ?)");
      stmt.run(id, name, type || 'asset');
      res.status(201).json({ id, name, type });
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.delete("/api/categories/:name", (req, res) => {
    const { name } = req.params;
    const { type } = req.query;
    try {
      const stmt = db.prepare("DELETE FROM categories WHERE name = ? AND type = ?");
      stmt.run(name, type || 'asset');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // --- Assets & Folders API ---
  app.post("/api/upload", upload.array('files'), (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const { folderId, enterpriseId, partnerId, docCategory } = req.body;
      const uploadedAssets = [];

      const stmt = db.prepare(`
        INSERT INTO assets (id, name, type, size, url, folder_id, enterprise_id, partner_id, doc_category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Type assertion for req.files since we used upload.array()
      const files = req.files as Express.Multer.File[];

      for (const file of files) {
        const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Determine asset type based on mimetype
        let assetType = 'Document';
        if (file.mimetype.startsWith('image/')) assetType = 'Image';
        else if (file.mimetype.startsWith('video/')) assetType = 'Video';

        // Format size
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        
        // Construct public URL
        const url = `/uploads/${file.filename}`;

        stmt.run(id, file.originalname, assetType, sizeInMB, url, folderId || null, enterpriseId || null, partnerId || null, docCategory || null);
        
        uploadedAssets.push({
          id,
          name: file.originalname,
          type: assetType,
          size: sizeInMB,
          url,
          folderId: folderId || null,
          enterpriseId: enterpriseId || null,
          partnerId: partnerId || null,
          docCategory: docCategory || null
        });
      }

      res.status(201).json(uploadedAssets);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to process upload" });
    }
  });

  app.get("/api/assets", (req, res) => {
    const { folderId, partnerId } = req.query;
    try {
      let stmt;
      if (partnerId) {
        stmt = db.prepare("SELECT * FROM assets WHERE partner_id = ?");
        res.json(stmt.all(partnerId));
      } else if (folderId) {
        stmt = db.prepare("SELECT * FROM assets WHERE folder_id = ? AND partner_id IS NULL");
        res.json(stmt.all(folderId));
      } else {
        stmt = db.prepare("SELECT * FROM assets WHERE folder_id IS NULL AND partner_id IS NULL");
        res.json(stmt.all());
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.put("/api/assets/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const stmt = db.prepare("UPDATE assets SET name = ? WHERE id = ?");
      stmt.run(name, id);
      res.json({ success: true });
    } catch (error) {
      console.error("Update asset error:", error);
      res.status(500).json({ error: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", (req, res) => {
    const { id } = req.params;
    try {
      // First get the file path to delete from disk
      const getStmt = db.prepare("SELECT url FROM assets WHERE id = ?");
      const asset = getStmt.get(id) as { url: string } | undefined;
      
      if (asset) {
        const filePath = path.join(process.cwd(), asset.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const delStmt = db.prepare("DELETE FROM assets WHERE id = ?");
      delStmt.run(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete asset error:", error);
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  app.post("/api/folders", (req, res) => {
    const { name, parentId, categoryTag, enterpriseId } = req.body;
    try {
      const id = `folder_${Date.now()}`;
      const stmt = db.prepare(`
        INSERT INTO folders (id, name, parent_id, category_tag, enterprise_id)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(id, name, parentId || null, categoryTag || null, enterpriseId || null);
      res.status(201).json({ id, name, parentId, categoryTag, enterpriseId, itemCount: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to create folder" });
    }
  });

  app.get("/api/folders", (req, res) => {
    const { parentId } = req.query;
    try {
      // Get folders and count their assets
      const query = `
        SELECT f.*, COUNT(a.id) as itemCount 
        FROM folders f 
        LEFT JOIN assets a ON f.id = a.folder_id 
        WHERE f.parent_id ${parentId ? '= ?' : 'IS NULL'}
        GROUP BY f.id
      `;
      const stmt = db.prepare(query);
      const folders = parentId ? stmt.all(parentId) : stmt.all();
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch folders" });
    }
  });

  // --- Partners API ---
  app.get("/api/partners", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM partners");
      const partners = stmt.all().map((p: any) => ({
        ...p,
        isStrategic: Boolean(p.is_strategic),
        images: JSON.parse(p.images || '[]'),
        dimensions: JSON.parse(p.dimensions || '{}'),
        docs: JSON.parse(p.docs || '[]')
      }));
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  app.post("/api/partners", (req, res) => {
    const partner = req.body;
    try {
      const id = partner.id || `partner_${Date.now()}`;
      const stmt = db.prepare(`
        INSERT INTO partners (id, name, category, location, is_strategic, email, phone, images, dimensions, docs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          category=excluded.category,
          location=excluded.location,
          is_strategic=excluded.is_strategic,
          email=excluded.email,
          phone=excluded.phone,
          images=excluded.images,
          dimensions=excluded.dimensions,
          docs=excluded.docs
      `);
      
      stmt.run(
        id,
        partner.name,
        partner.category,
        partner.location,
        partner.isStrategic ? 1 : 0,
        partner.email,
        partner.phone,
        JSON.stringify(partner.images || []),
        JSON.stringify(partner.dimensions || {}),
        JSON.stringify(partner.docs || [])
      );
      
      res.status(201).json({ ...partner, id });
    } catch (error) {
      console.error("Save partner error:", error);
      res.status(500).json({ error: "Failed to save partner" });
    }
  });

  // Download Source Code
  app.get("/api/download-zip", (req, res) => {
    res.attachment("source-code.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    archive.on("error", (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    // Append files from the current directory, ignoring node_modules and dist
    archive.glob("**/*", {
      cwd: process.cwd(),
      ignore: ["node_modules/**", "dist/**", ".git/**"],
      dot: true
    });

    archive.finalize();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
