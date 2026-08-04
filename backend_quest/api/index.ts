import { handle } from 'hono/vercel'
import app from '../src/index' // เช็กว่า src/index.ts อยู่ตรงนี้จริงไหม (ถ้าชื่ออื่นต้องเปลี่ยนให้ตรง)

export const runtime = 'nodejs'
export default handle(app)