import { AzureOpenAI } from 'openai'
import { z } from 'zod'
import { NextResponse } from 'next/server'

let client: AzureOpenAI | null = null;

const categorySchema = z.object({
  categoryId: z.string().describe('The ID of the most appropriate category'),
  confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1'),
  reasoning: z.string().describe('Brief explanation for the categorization'),
})

console.log('[v0] Route file loaded') 

export async function POST(req: Request) {

  try {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    if (!apiKey || !endpoint || !apiVersion || !deployment) {
      console.error('[v0] Missing Azure OpenAI Environment Variables:', {
        hasKey: !!apiKey,
        hasEndpoint: !!endpoint,
        hasVersion: !!apiVersion,
        hasDeployment: !!deployment
      });
      return NextResponse.json(
        { error: 'Server configuration error: Missing Azure environment variables' },
        { status: 500 }
      );
    }

    if (!client) {
      client = new AzureOpenAI({
        endpoint,
        apiKey,
        deployment,
        apiVersion,
        dangerouslyAllowBrowser: true,
      });
    }

    const { message, categories } = await req.json()

    console.log('[v0] Categories received:', categories)

    const categoriesText = categories
      .map((cat: any) => `${cat.id}: ${cat.name}${cat.description ? ' - ' + cat.description : ''}`)
      .join('\n')

    const prompt = `You are an AI assistant that categorizes messages in a team communication platform.

Available categories:
${categoriesText}

Message to categorize:
"${message}"

Analyze the message and determine which category best fits. Consider the content, intent, and tone of the message.

Respond with a JSON object matching this schema:
{
  "categoryId": "string (The ID of the most appropriate category)",
  "confidence": "number between 0 and 1",
  "reasoning": "string (Brief explanation for the categorization)"
}`

    console.log('[v0] Calling Azure OpenAI with deployment:', deployment)

    const completion = await client.chat.completions.create({
      model: deployment, 
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that categorizes messages. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_completion_tokens: 500,
    })

    console.log('[v0] Azure OpenAI response received')
    
    const content = completion.choices[0].message.content
    if (!content) throw new Error('No content in response')

    const parsed = JSON.parse(content)
    console.log('[v0] Categorization result:', parsed)

    const object = categorySchema.parse(parsed)

    return NextResponse.json(object)

  } catch (error: any) {
    console.error('[v0] Error detail:', error);

    if (error.response) {
       console.error(error.response.status);
       console.error(error.response.data);
    }

    return NextResponse.json(
      { error: 'Failed to categorize message', details: error.message },
      { status: 500 }
    )
  }
}
