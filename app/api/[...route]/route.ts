import { Hono } from 'hono'
import { handle } from 'hono/vercel'
export const runtime = 'edge'
import prisma from '../../../prisma.js';
const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  })
})
console.log('dvc')
app.post('/users', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // You may want to add validation here
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const user = await prisma.user.create({
      data: { email, password, name },
    });

    return c.json(user, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
})
app.get('/users', async (c) => {
  try {
    const users = await prisma.user.findMany();
    return c.json(users, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});
export const GET = handle(app)
export const POST = handle(app)
