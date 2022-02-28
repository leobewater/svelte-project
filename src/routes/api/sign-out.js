// src/routes/api/sign-out.js
import { removeSession } from './_db'
import { parse, serialize } from 'cookie'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ request }) {
  // use a GET request because the client doesn’t have to actively send any data (remember, the cookie will be sent automatically). We remove the session from our in-memory database and remove the cookie by unsettling the value and setting an immediate expiration date:

	const cookies = parse(request.headers.get('cookie') || '');

  if (cookies.session_id) {
    await removeSession(cookies.session_id)
  }

  return {
    status: 200,
    headers: {
      'Set-Cookie': serialize('session_id', '', {
        path: '/',
        expires: new Date(0),
      }),
    },
  }
}
