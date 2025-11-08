import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d4db93d1/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-d4db93d1/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, avatarUrl } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Missing required fields: email, password, name" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile data in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      avatarUrl: avatarUrl || '',
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      user: {
        id: userId,
        email,
        name,
        avatarUrl: avatarUrl || ''
      }
    });
  } catch (error) {
    console.log(`Signup error during user creation: ${error}`);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-d4db93d1/user/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    const profile = await kv.get(`user:${userId}`);

    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user: profile });
  } catch (error) {
    console.log(`Get user error: ${error}`);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// Update user avatar endpoint
app.put("/make-server-d4db93d1/user/:userId/avatar", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    if (user.id !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const body = await c.req.json();
    const { avatarUrl } = body;

    if (!avatarUrl) {
      return c.json({ error: "Missing avatarUrl" }, 400);
    }

    const profile = await kv.get(`user:${userId}`);
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedProfile = {
      ...profile,
      avatarUrl,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${userId}`, updatedProfile);

    return c.json({ success: true, user: updatedProfile });
  } catch (error) {
    console.log(`Update avatar error: ${error}`);
    return c.json({ error: "Failed to update avatar" }, 500);
  }
});

// AI Chat endpoint
app.post("/make-server-d4db93d1/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: "Missing or invalid messages array" }, 400);
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.log('Chat error: GEMINI_API_KEY environment variable not set');
      return c.json({ error: "Gemini API key not configured" }, 500);
    }

    // System context about Princeton campus
    const systemContext = `You are a helpful AI assistant for an immersive 3D virtual campus experience of Princeton University. This is a social metaverse platform for Princeton students, freshmen, and visitors to explore and connect.

FEATURES:
- First-person avatar exploration: Users can create personalized 3D avatars in three ways:
  1. Webcam-based facial scanning via Avatarun
  2. AI-powered Text-to-3D generation (describe your avatar and AI creates it)
  3. Default generic avatars for quick start
- Multiplayer social: See and interact with other students' avatars in real-time as they walk around campus
- Complete campus: Includes eating clubs, residential colleges, academic buildings, libraries, cafes, research labs, athletic facilities
- Time of day controls (day, sunset, night)
- Interactive buildings with detailed information
- Dorm/residential college assignments
- Friend system to see where friends are on campus

AVATAR CREATION:
- Text-to-3D: Users describe their avatar in natural language (e.g., "a friendly student with curly hair wearing a Princeton hoodie"), and our AI system enhances the prompt using Gemini and generates a custom 3D model using Meshy API
- Takes 2-5 minutes to generate
- Creates unique, personalized GLB models
- Examples: Classic student, athletic look, professional style, artistic vibe

EATING CLUBS (11):
Tiger Inn, Ivy Club, Cottage Club, Cap and Gown, Colonial Club, Quadrangle Club, Tower Club, Cloister Inn, Cannon Club, Terrace Club, Charter Club

RESIDENTIAL COLLEGES:
Mathey College, Rockefeller College, Butler College, Whitman College, Forbes College, New College West (Yoseloff)

KEY BUILDINGS:
- Academic: Nassau Hall, McCosh Hall, Robertson Hall, Friend Center, Architecture School
- Libraries: Firestone Library, Lewis Science Library, Chancellor Green
- Dining: Frist Campus Center, multiple residential dining halls
- Cafes: Small World Coffee, Starbucks, Uncommon Grounds, Chancellor Café
- Research: Engineering Quad, Jadwin Hall, Icahn Lab, Green Hall
- Athletic: Dillon Gym, Jadwin Gymnasium

VIEW MODES:
1. Orbital View: Bird's-eye camera for overview
2. First-Person Mode: Walk through campus as your avatar (WASD to move, mouse to look)

PURPOSE: Help freshmen and visitors get familiar with Princeton, discover resources, and create a social connection to campus before even arriving. Students can see where friends live, find study spots, locate cafes, and explore the full university experience.

Be helpful, friendly, and enthusiastic about Princeton! Answer questions about campus life, buildings, features, or how to use the 3D visualization.`;

    // Convert messages to Gemini format
    const geminiMessages = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Prepend system context to first user message
    if (geminiMessages.length > 0 && geminiMessages[0].role === 'user') {
      geminiMessages[0].parts[0].text = `${systemContext}\n\nUser: ${geminiMessages[0].parts[0].text}`;
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Gemini API error: ${response.status} - ${errorText}`);
      return c.json({ 
        error: "Failed to get AI response",
        details: `Gemini API returned ${response.status}`,
        geminiError: errorText 
      }, 500);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data));
    
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      console.log('Gemini API returned no message content. Full response:', JSON.stringify(data));
      return c.json({ 
        error: "No response from AI",
        details: "Gemini returned empty content",
        geminiResponse: data 
      }, 500);
    }

    return c.json({ message: assistantMessage });
  } catch (error) {
    console.log(`Chat endpoint error: ${error}`);
    return c.json({ 
      error: "Failed to process chat request",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Generate avatar with Avatarun API endpoint
app.post("/make-server-d4db93d1/generate-avatar", async (c) => {
  try {
    const formData = await c.req.formData();
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof File)) {
      return c.json({ error: "Missing or invalid image file" }, 400);
    }

    // For now, return a placeholder URL until Avatarun API is properly integrated
    // TODO: Integrate actual Avatarun API when API key is provided
    // This is a mock implementation that demonstrates the flow
    
    // In production, you would:
    // 1. Upload the image to Avatarun API
    // 2. Wait for avatar generation
    // 3. Get the GLB/GLTF model URL
    // 4. Return the URL
    
    const mockAvatarUrl = `https://models.readyplayer.me/placeholder-avatar-${Date.now()}.glb`;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return c.json({ 
      avatarUrl: mockAvatarUrl,
      message: "Avatar generated successfully (mock)"
    });
  } catch (error) {
    console.log(`Generate avatar error: ${error}`);
    return c.json({ error: "Failed to generate avatar" }, 500);
  }
});

// User position tracking for multiplayer
app.post("/make-server-d4db93d1/update-position", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { position, rotation } = body;

    if (!position || !rotation) {
      return c.json({ error: "Missing position or rotation data" }, 400);
    }

    // Store user position with timestamp
    await kv.set(`position:${user.id}`, {
      userId: user.id,
      position,
      rotation,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(`Update position error: ${error}`);
    return c.json({ error: "Failed to update position" }, 500);
  }
});

// Get all active user positions for multiplayer
app.get("/make-server-d4db93d1/active-users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all position entries
    const positions = await kv.getByPrefix('position:');
    
    // Filter out stale positions (older than 30 seconds) and current user
    const now = new Date();
    const activeUsers = positions
      .filter(pos => {
        const timestamp = new Date(pos.timestamp);
        const ageInSeconds = (now.getTime() - timestamp.getTime()) / 1000;
        return ageInSeconds < 30 && pos.userId !== user.id;
      })
      .map(async (pos) => {
        const userProfile = await kv.get(`user:${pos.userId}`);
        return {
          userId: pos.userId,
          name: userProfile?.name || 'Unknown',
          avatarUrl: userProfile?.avatarUrl || '',
          position: pos.position,
          rotation: pos.rotation
        };
      });

    const resolvedUsers = await Promise.all(activeUsers);

    return c.json({ users: resolvedUsers });
  } catch (error) {
    console.log(`Get active users error: ${error}`);
    return c.json({ error: "Failed to get active users" }, 500);
  }
});

// Update user profile with dorm assignment
app.put("/make-server-d4db93d1/user/:userId/dorm", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param('userId');
    if (user.id !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const body = await c.req.json();
    const { dormId, dormName } = body;

    if (!dormId || !dormName) {
      return c.json({ error: "Missing dormId or dormName" }, 400);
    }

    const profile = await kv.get(`user:${userId}`);
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedProfile = {
      ...profile,
      dormId,
      dormName,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${userId}`, updatedProfile);

    return c.json({ success: true, user: updatedProfile });
  } catch (error) {
    console.log(`Update dorm error: ${error}`);
    return c.json({ error: "Failed to update dorm assignment" }, 500);
  }
});

// Verify ElevenLabs API key endpoint
app.get("/make-server-d4db93d1/verify-elevenlabs-key", async (c) => {
  try {
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!elevenLabsApiKey) {
      return c.json({ 
        valid: false, 
        keyMissing: true,
        message: "ELEVENLABS_API_KEY environment variable not set" 
      });
    }

    // Test the API key with a simple request
    const response = await fetch(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'xi-api-key': elevenLabsApiKey,
        },
      }
    );

    if (!response.ok) {
      return c.json({ 
        valid: false, 
        keyMissing: false,
        message: "API key is invalid or expired" 
      });
    }

    return c.json({ 
      valid: true, 
      keyMissing: false,
      message: "API key is valid" 
    });
  } catch (error) {
    console.log(`Verify ElevenLabs key error: ${error}`);
    return c.json({ 
      valid: false, 
      keyMissing: false,
      message: "Failed to verify API key" 
    }, 500);
  }
});

// Text-to-Speech with ElevenLabs endpoint
app.post("/make-server-d4db93d1/text-to-speech", async (c) => {
  try {
    const body = await c.req.json();
    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM", stability = 0.5, similarityBoost = 0.75, model = "eleven_monolingual_v1" } = body;

    if (!text) {
      return c.json({ error: "Missing text for speech synthesis" }, 400);
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      console.log('Text-to-speech error: ELEVENLABS_API_KEY environment variable not set');
      return c.json({ error: "ElevenLabs API key not configured", keyMissing: true }, 500);
    }

    console.log(`Generating speech for text: "${text.substring(0, 50)}..."`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`ElevenLabs API error: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to generate speech" }, 500);
    }

    // Get audio as array buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    return c.json({ 
      audioBase64: base64Audio,
      mimeType: 'audio/mpeg'
    });
  } catch (error) {
    console.log(`Text-to-speech error: ${error}`);
    return c.json({ error: "Failed to generate speech" }, 500);
  }
});

// Text-to-3D Avatar Generation endpoint
app.post("/make-server-d4db93d1/generate-avatar-from-text", async (c) => {
  try {
    const body = await c.req.json();
    const { description } = body;

    if (!description) {
      return c.json({ error: "Missing avatar description" }, 400);
    }

    // Check for API keys
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const meshyApiKey = Deno.env.get('MESHY_API_KEY');

    if (!geminiApiKey) {
      console.log('Text-to-3D error: GEMINI_API_KEY environment variable not set');
      return c.json({ error: "Gemini API key not configured" }, 500);
    }

    if (!meshyApiKey) {
      console.log('Text-to-3D error: MESHY_API_KEY environment variable not set');
      return c.json({ error: "Meshy API key not configured" }, 500);
    }

    // Step 1: Enhance the prompt using Gemini
    console.log(`Enhancing prompt with Gemini: "${description}"`);
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert at creating detailed 3D character descriptions for avatar generation. 
              
The user wants to create a 3D avatar with this description: "${description}"

Enhance this into a detailed, professional prompt for 3D character generation that focuses on:
- Physical appearance (face, body type, clothing style)
- Character style (realistic, stylized, cartoon, etc.)
- Key features and accessories
- Overall aesthetic

Keep it under 200 words and make it very specific and visual. Focus only on the character itself, not backgrounds or environments. Output only the enhanced prompt, nothing else.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.log(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      return c.json({ error: "Failed to enhance prompt with AI" }, 500);
    }

    const geminiData = await geminiResponse.json();
    const enhancedPrompt = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!enhancedPrompt) {
      console.log('Gemini API returned no enhanced prompt');
      return c.json({ error: "Failed to enhance prompt" }, 500);
    }

    console.log(`Enhanced prompt: "${enhancedPrompt}"`);

    // Step 2: Generate 3D model using Meshy API
    console.log('Initiating Meshy text-to-3D generation...');
    
    const meshyResponse = await fetch(
      'https://api.meshy.ai/v2/text-to-3d',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${meshyApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'preview',
          prompt: enhancedPrompt,
          art_style: 'realistic',
          negative_prompt: 'low quality, low resolution, low poly, ugly, distorted, deformed',
          ai_model: 'meshy-4',
          topology: 'quad',
        }),
      }
    );

    if (!meshyResponse.ok) {
      const errorText = await meshyResponse.text();
      console.log(`Meshy API error: ${meshyResponse.status} - ${errorText}`);
      return c.json({ error: "Failed to start 3D generation" }, 500);
    }

    const meshyData = await meshyResponse.json();
    const taskId = meshyData.result;

    if (!taskId) {
      console.log('Meshy API returned no task ID');
      return c.json({ error: "Failed to start 3D generation" }, 500);
    }

    console.log(`Meshy task created: ${taskId}`);

    // Step 3: Poll for completion (with timeout)
    let modelUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes maximum (5 second intervals)

    while (!modelUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;

      console.log(`Polling Meshy task status (attempt ${attempts}/${maxAttempts})...`);

      const statusResponse = await fetch(
        `https://api.meshy.ai/v2/text-to-3d/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${meshyApiKey}`,
          },
        }
      );

      if (!statusResponse.ok) {
        console.log(`Failed to check status: ${statusResponse.status}`);
        continue;
      }

      const statusData = await statusResponse.json();
      console.log(`Task status: ${statusData.status}, progress: ${statusData.progress || 0}%`);

      if (statusData.status === 'SUCCEEDED') {
        modelUrl = statusData.model_urls?.glb || statusData.model_urls?.gltf;
        console.log(`3D model generated successfully: ${modelUrl}`);
      } else if (statusData.status === 'FAILED') {
        console.log(`Meshy generation failed: ${statusData.error || 'Unknown error'}`);
        return c.json({ error: "3D generation failed" }, 500);
      }
    }

    if (!modelUrl) {
      console.log('Meshy generation timed out after 5 minutes');
      return c.json({ 
        error: "3D generation is taking longer than expected. Please try again later.",
        taskId // Return task ID so frontend could potentially poll separately
      }, 408);
    }

    return c.json({ 
      avatarUrl: modelUrl,
      enhancedPrompt,
      taskId,
      message: "3D avatar generated successfully"
    });

  } catch (error) {
    console.log(`Text-to-3D generation error: ${error}`);
    return c.json({ error: "Failed to generate 3D avatar from text" }, 500);
  }
});

Deno.serve(app.fetch);