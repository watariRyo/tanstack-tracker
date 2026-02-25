import { ClerkProvider } from '@clerk/tanstack-react-start';
import poppins100 from '@fontsource/poppins/100.css?url';
import poppins200 from '@fontsource/poppins/200.css?url';
import poppins300 from '@fontsource/poppins/300.css?url';
import poppins400 from '@fontsource/poppins/400.css?url';
import poppins500 from '@fontsource/poppins/500.css?url';
import poppins600 from '@fontsource/poppins/600.css?url';
import poppins700 from '@fontsource/poppins/700.css?url';
import poppins800 from '@fontsource/poppins/800.css?url';
import poppins900 from '@fontsource/poppins/900.css?url';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';
import { getSignedInUserId } from '@/data/get-signed-in-user-id';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
	pendingMs: 0,
	pendingComponent: () => <div></div>,
	notFoundComponent() {
		return (
			<div className="text-3xl text-center py-10 text-muted-foreground">
				404 - Not Found
			</div>
		);
	},
	beforeLoad: async () => {
		const userId = await getSignedInUserId();
		return {
			userId,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'TanStack Start Starter',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
			{ rel: 'stylesheet', href: poppins100 },
			{ rel: 'stylesheet', href: poppins200 },
			{ rel: 'stylesheet', href: poppins300 },
			{ rel: 'stylesheet', href: poppins400 },
			{ rel: 'stylesheet', href: poppins500 },
			{ rel: 'stylesheet', href: poppins600 },
			{ rel: 'stylesheet', href: poppins700 },
			{ rel: 'stylesheet', href: poppins800 },
			{ rel: 'stylesheet', href: poppins900 },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<HeadContent />
			</head>
			<body>
				<ClerkProvider>
					<nav className="bg-primary p-4 h-20 text-white flex items-center justify-between">
						<Header />
					</nav>
					{children}
					<Toaster />
				</ClerkProvider>
				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
