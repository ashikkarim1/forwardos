export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Forward OS API is running'
  })
}
