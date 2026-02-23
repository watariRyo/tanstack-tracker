import { auth } from '@clerk/tanstack-react-start/server';
import { createMiddleware } from '@tanstack/react-start';

const authMiddleware = createMiddleware().server(async ({ next }) => {
	const user = await auth();

	if (!user?.userId) {
		throw new Error('Unauthorized');
	}

	const results = await next({
		context: {
			userId: user.userId,
		},
	});
	return results;
});

export default authMiddleware;
