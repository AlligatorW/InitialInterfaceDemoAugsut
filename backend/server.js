import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt = `You are a digital medical assistant.
Your job is to gather information from patients in a friendly, efficient, and structured way.
You should:
- Greet the patient and ask why they are here today.
- Ask one clarifying question if needed.
- Never guess or diagnose; focus on gathering accurate info for the healthcare provider.
- Use plain language. If the user sounds upset or confused, be supportive.
- Extract and list symptoms in bullet point form.`

app.post('/chat', async (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).send('Invalid message')
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message }
  ]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages
    })

    res.json({ reply: response.choices[0].message.content })
  } catch (err) {
    console.error('OpenAI API error:', err)
    res.status(500).send('OpenAI API error')
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})

