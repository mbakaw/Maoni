import { env } from 'cloudflare:workers';

const topics = new Set(['Life & community', 'Politics & power', 'Climate & land', 'Identity & culture']);
const json = (value: unknown, status = 200) => Response.json(value, {status, headers: {'cache-control': 'no-store'}});

async function visitorHash(request: Request) {
  const token = request.headers.get('x-maoni-visitor') || '';
  if (!/^[a-f0-9-]{36,80}$/.test(token)) return null;
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join('');
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function GET(request: Request) {
  try {
    const visitor = await visitorHash(request) || '';
    const rows = await env.DB.prepare(`SELECT p.id, p.name, p.text, p.topic, p.created_at AS createdAt,
      (SELECT COUNT(*) FROM maoni_votes v WHERE v.post_id = p.id) AS agreements,
      EXISTS(SELECT 1 FROM maoni_votes v WHERE v.post_id = p.id AND v.visitor_hash = ?) AS agreed,
      (p.author_hash = ?) AS mine
      FROM maoni_posts p ORDER BY p.created_at DESC LIMIT 100`).bind(visitor, visitor).all();
    return json({posts: rows.results});
  } catch (error) {
    console.error('Wall read failed', error);
    return json({error: 'The wall could not load. Please try again.'}, 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({error: 'Please post from the Maoni website.'}, 403);
  if (Number(request.headers.get('content-length') || 0) > 5000) return json({error: 'That maoni is too long.'}, 413);
  const visitor = await visitorHash(request);
  if (!visitor) return json({error: 'Please refresh and try again.'}, 400);
  try {
    const body = await request.json() as {name?: unknown; text?: unknown; topic?: unknown; consent?: unknown};
    const name = typeof body.name === 'string' ? body.name.trim() || 'Anonymous' : 'Anonymous';
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const topic = typeof body.topic === 'string' ? body.topic : '';
    if (body.consent !== true || name.length > 40 || text.length < 5 || text.length > 400 || !topics.has(topic)) {
      return json({error: 'Add 5–400 characters, choose a topic and confirm you want to share.'}, 400);
    }
    const recent = await env.DB.prepare('SELECT COUNT(*) AS total FROM maoni_posts WHERE author_hash = ? AND created_at > ?').bind(visitor, Date.now() - 3600000).first<{total: number}>();
    if ((recent?.total || 0) >= 5) return json({error: 'You’ve posted five maoni this hour. Leave a little space for the room and try later.'}, 429);
    const id = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO maoni_posts (id, name, text, topic, author_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, name, text, topic, visitor, Date.now()).run();
    return json({id}, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return json({error: 'Please check the form and try again.'}, 400);
    console.error('Wall write failed', error);
    return json({error: 'Your maoni wasn’t saved. Please try again.'}, 503);
  }
}

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return json({error: 'Please use the Maoni website.'}, 403);
  const visitor = await visitorHash(request);
  if (!visitor) return json({error: 'Please refresh and try again.'}, 400);
  try {
    const {id} = await request.json() as {id: unknown};
    if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) return json({error: 'Post not found.'}, 400);
    const post = await env.DB.prepare('SELECT id FROM maoni_posts WHERE id = ?').bind(id).first();
    if (!post) return json({error: 'That maoni has been removed.'}, 404);
    const exists = await env.DB.prepare('SELECT post_id FROM maoni_votes WHERE post_id = ? AND visitor_hash = ?').bind(id, visitor).first();
    if (exists) await env.DB.prepare('DELETE FROM maoni_votes WHERE post_id = ? AND visitor_hash = ?').bind(id, visitor).run();
    else await env.DB.prepare('INSERT OR IGNORE INTO maoni_votes (post_id, visitor_hash) VALUES (?, ?)').bind(id, visitor).run();
    const total = await env.DB.prepare('SELECT COUNT(*) AS total FROM maoni_votes WHERE post_id = ?').bind(id).first<{total:number}>();
    return json({agreed: !exists, agreements: total?.total || 0});
  } catch (error) {
    console.error('Wall reaction failed', error);
    return json({error: 'Your reaction wasn’t saved. Please try again.'}, 503);
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({error: 'Please use the Maoni website.'}, 403);
  const visitor = await visitorHash(request);
  if (!visitor) return json({error: 'Please refresh and try again.'}, 400);
  try {
    const {id} = await request.json() as {id: unknown};
    if (typeof id !== 'string') return json({error: 'Post not found.'}, 400);
    const post = await env.DB.prepare('SELECT id FROM maoni_posts WHERE id = ? AND author_hash = ?').bind(id, visitor).first();
    if (!post) return json({error: 'You can only remove a maoni posted from this browser.'}, 403);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM maoni_votes WHERE post_id = ?').bind(id),
      env.DB.prepare('DELETE FROM maoni_posts WHERE id = ? AND author_hash = ?').bind(id, visitor),
    ]);
    return json({removed:true});
  } catch (error) {
    console.error('Wall delete failed', error);
    return json({error: 'Your maoni wasn’t removed. Please try again.'}, 503);
  }
}
