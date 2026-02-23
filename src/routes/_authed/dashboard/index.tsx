import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/dashboard/')({
	beforeLoad: ({ context }) => {
		if (!context.userId) {
			throw new Error('User is not signed in');
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Dashboard</div>;
}
