// The handle hook runs on every request (and during prerendering). It gives us access to the request and allows us to modify the response
import { parse } from 'cookie'
import { getSession as getSessionFromApi } from './routes/api/_db'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const cookies = parse(event.request.headers.get('cookie') || '')

  if (cookies.session_id) {
    const session = await getSessionFromApi(cookies.session_id)
    if (session) {
      event.locals.user = { email: session.email }
      return resolve(event)
    }
  }

  event.locals.user = null
  return resolve(event)
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
  return event?.locals?.user
    ? {
        user: {
          email: event.locals.user.email,
        },
      }
    : {}
}

// import cookie from 'cookie';
// import { v4 as uuid } from '@lukeed/uuid';
// import type { Handle } from '@sveltejs/kit';

// export const handle: Handle = async ({ event, resolve }) => {
// 	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
// 	event.locals.userid = cookies.userid || uuid();

// 	const response = await resolve(event);

// 	if (!cookies.userid) {
// 		// if this is the first time the user has visited this app,
// 		// set a cookie so that we recognise them when they return
// 		response.headers.set(
// 			'set-cookie',
// 			cookie.serialize('userid', event.locals.userid, {
// 				path: '/',
// 				httpOnly: true
// 			})
// 		);
// 	}

// 	return response;
// };
