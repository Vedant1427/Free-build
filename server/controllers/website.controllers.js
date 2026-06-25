import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

const masterPrompt = `
You are an elite frontend developer who creates STUNNING, production-grade websites.
Build a complete, premium website using HTML + CSS + JavaScript in a SINGLE HTML file.

USER REQUIREMENT: {USER_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ONE single HTML file
- ONE <style> tag with ALL CSS (must be extensive — 200+ lines of CSS minimum)
- ONE <script> tag with ALL JavaScript
- Google Fonts via @import inside <style>: use Inter for body, Playfair Display for headings
- NO external libraries or frameworks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN REQUIREMENTS (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CSS must include:
- :root variables for colors, fonts, spacing, border-radius
- Dark theme (bg: #0a0a0f, cards: rgba(255,255,255,0.04))
- Glassmorphism: backdrop-filter: blur(20px), semi-transparent backgrounds, subtle borders
- Gradient text on hero heading: background-clip: text
- Gradient buttons with hover glow effects
- box-shadow with colored tints on hover
- Smooth transitions: transition: all 0.3s ease on interactive elements
- @keyframes fadeInUp, fadeIn for animations
- CSS Grid and Flexbox layouts
- clamp() for fluid typography

IMAGES (MANDATORY):
- Use real Unsplash URLs: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w={WIDTH}&q=80
- Hero MUST have a large background/featured image
- Include 5+ images total across sections
- Use these real photo IDs based on topic:
  Tech: 1518770660439-4636190af475, 1519389950473-47ba0277781c
  Business: 1497366216548-37526070297c, 1497366811353-6870744d04b2
  Food: 1504674900247-0877df9cc836, 1414235077428-338989a2e8c0
  People: 1507003211169-0a1dd7228f2d, 1494790108377-be9c29b29330, 1472099645785-5658abf4ff4e
  Nature: 1441974231531-c6227db76b6e, 1470071459604-3b5ec3a7fe05
- All images: object-fit: cover, max-width: 100%, border-radius

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED SECTIONS (all must be present)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NAVBAR — sticky, glassmorphism, logo + links + CTA button, hamburger on mobile
2. HERO — full viewport, background image with gradient overlay, gradient heading, 2 CTA buttons, badge/pill label
3. FEATURES — 3-4 glassmorphism cards in CSS Grid, SVG icons, hover lift effect
4. ABOUT/STATS — split layout (image + text), 3-4 stat counters with large numbers
5. TESTIMONIALS — 2-3 cards with Unsplash avatar photos, names, star ratings, quotes
6. FAQ — accordion with smooth max-height transitions, rotating chevron
7. CTA/NEWSLETTER — gradient background, email input + button
8. FOOTER — 4-column grid, social SVG icons, links, copyright

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JAVASCRIPT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Mobile hamburger menu toggle
- Smooth scroll navigation (scroll-behavior: smooth)
- IntersectionObserver: add .visible class to elements on scroll for fadeInUp animation
- FAQ accordion click handlers
- Active nav link updates on scroll
- Contact form validation with visual feedback
- Use inline SVG icons (24x24 viewBox, stroke-based)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE DESIGN (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Mobile-first: base styles for <768px
- @media (min-width: 768px): 2-column grids
- @media (min-width: 1024px): full multi-column layouts
- *, *::before, *::after { box-sizing: border-box }
- img { max-width: 100%; height: auto }
- body { overflow-x: hidden }
- Hamburger menu on mobile, full nav on desktop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Write realistic, professional copy — NO lorem ipsum
- Use compelling CTAs: "Get Started Free", "Book a Demo"
- Include real-sounding names, job titles in testimonials
- Use specific numbers in stats: "500+ Clients", "98% Satisfaction"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — RAW JSON ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "message": "Short confirmation of what was built",
  "code": "<FULL HTML DOCUMENT with embedded <style> and <script> tags>"
}

RETURN ONLY THE JSON. No markdown, no explanations, no extra text.
`;


export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: "you have not enough credits to generate a webiste" })
        }

        const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt)
        let raw = ""
        let parsed = null
        
        // Try up to 2 times max (not 4 like before)
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(finalPrompt)
            parsed = await extractJson(raw)
        }

        if (!parsed || !parsed.code) {
            console.log("ai returned invalid response", raw)
            return res.status(400).json({ message: "ai returned invalid response" })
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "ai",
                    content: parsed.message
                }
                
            ]
        })

        user.credits = user.credits - 50
        await user.save()

        return res.status(201).json({
            websiteId: website._id,
            remainingCredits: user.credits
        })

    } catch (error) {
        return res.status(500).json({ message: `generate website error ${error}` })
    }
}


export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }
        return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({ message: `get website by id error ${error}` })
    }
}


export const changes = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }

        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 25) {
            return res.status(400).json({ message: "you have not enough credits to generate a webiste" })
        }

        const updatePrompt = `
You are an elite frontend developer updating a premium website.

CURRENT WEBSITE CODE:
${website.latestCode}

USER CHANGE REQUEST:
${prompt}

RULES:
1. Apply the requested changes while MAINTAINING all premium quality
2. KEEP all existing: Google Fonts, CSS variables, glassmorphism, animations, responsive media queries
3. For new content: use Unsplash images, match existing design language, add scroll animations
4. NEVER degrade quality — every update should make the site BETTER
5. Return the COMPLETE updated HTML file (not just changed parts)
6. The code must include full <style> and <script> tags with all CSS and JavaScript

OUTPUT — RAW JSON ONLY:
{
  "message": "Short description of what was changed",
  "code": "<COMPLETE UPDATED HTML DOCUMENT>"
}

RETURN ONLY THE JSON. No markdown, no explanations.
`
        let raw = ""
        let parsed = null
        
        // Try up to 2 times max
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(updatePrompt)
            parsed = await extractJson(raw)
        }

        if (!parsed || !parsed.code) {
            console.log("ai returned invalid response", raw)
            return res.status(400).json({ message: "ai returned invalid response" })
        }


        website.conversation.push(
            { role: "user", content: prompt },
            { role: "ai", content: parsed.message },
        )

        website.latestCode = parsed.code

        await website.save()
        user.credits = user.credits - 25
        await user.save()

        return res.status(200).json({
            message:parsed.message,
            code:parsed.code,
            remainingCredits: user.credits
        })


    } catch (error) {
        console.log(error)
 return res.status(500).json({ message: `update website error ${error}` })
    }
}



export const getAll=async (req,res) => {
    try {
        const websites=await Website.find({user:req.user._id})
        return res.status(200).json(websites)
    } catch (error) {
        return res.status(500).json({ message: `get all websites error ${error}` })
    }
}


export const deploy=async (req,res)=>{
    try {
         const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }

        if(!website.slug){
            website.slug=website.title.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,60)+website._id.toString().slice(-5)              
        }

        website.deployed=true
        website.deployUrl=`${process.env.FRONTEND_URL}/site/${website.slug}`
        await website.save()

        return res.status(200).json({
            url:website.deployUrl
        })

    } catch (error) {
         return res.status(500).json({ message: `deploy website error ${error}` })
    }
}


export const getBySlug=async (req,res) => {
    try {
         const website = await Website.findOne({
            slug: req.params.slug
        })

        if (!website) {
            return res.status(400).json({ message: "website not found" })
        }
          return res.status(200).json(website)
    } catch (error) {
        return res.status(500).json({ message: `get by slug website error ${error}` })
    }
}