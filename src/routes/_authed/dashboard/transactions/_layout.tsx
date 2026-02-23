import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const Route = createFileRoute('/_authed/dashboard/transactions/_layout')(
	{
		beforeLoad: ({ context }) => {
			if (!context.userId) {
				throw new Error('User is not signed in');
			}
		},
		component: RouteComponent,
	},
);

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto py-10">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Transactions</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Outlet />
		</div>
	);
}
