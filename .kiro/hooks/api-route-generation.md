# API Route Generation Hook

## Purpose
Streamlines creation of new API routes with consistent patterns.

## Trigger
Creating new files in `app/api/` directory.

## Generated Structure

When creating a new API endpoint, this hook generates:

### 1. Route File Template
```typescript
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Request schema
const requestSchema = z.object({
  // Define your schema here
})

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = requestSchema.parse(body)
    
    // Implementation here
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Request failed" },
      { status: 400 }
    )
  }
}
```

### 2. Schema Export
Automatically adds schema to `src/schemas/index.ts`

### 3. Type Definition
Adds corresponding types to `src/types/index.ts`

## Example: Voice Endpoint Creation

When I created `/api/voice`, this hook:
1. Generated base route structure with proper runtime config
2. Added `voiceRequestSchema` to schemas
3. Suggested ElevenLabs integration pattern
4. Added error handling for quota exceeded (429)
5. Set proper audio/mpeg content-type headers

## Hauntify-Specific Patterns

For streaming endpoints like `/api/chat`:
- Uses SSE headers automatically
- Adds NDJSON event emission helpers
- Includes abort controller setup
- Generates proper cleanup logic
