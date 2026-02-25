import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import LoadingSkeleton from '@/components/loading-skeleton';
import { getRecentTransactions } from '@/data/get-recent-transactions';
import { getTransactionByYearsRange } from '@/data/get-transaction-by-years-range';
import { getAnnualCashflow } from '@/data/getAnnualCashflow';
import { Cashflow } from './-cachflow';
import { RecentTransactions } from './-recent-transaction';

const today = new Date();

const searchSchema = z.object({
	cfyear: z
		.number()
		.min(today.getFullYear() - 100)
		.max(today.getFullYear())
		.catch(today.getFullYear())
		.optional(),
});

export const Route = createFileRoute('/_authed/dashboard/')({
	pendingComponent: () => (
		<div className="max-w-7xl mx-auto py-5">
			<h1 className="text-4xl font-semibold">Dashboard</h1>
			<LoadingSkeleton />
		</div>
	),
	validateSearch: searchSchema,
	beforeLoad: ({ context }) => {
		if (!context.userId) {
			throw new Error('User is not signed in');
		}
	},
	component: RouteComponent,
	loaderDeps: ({ search }) => ({ cfyear: search.cfyear }),
	loader: async ({ deps }) => {
		const [transactions, cashflow, yearsRange] = await Promise.all([
			getRecentTransactions(),
			getAnnualCashflow({ data: { year: deps.cfyear ?? today.getFullYear() } }),
			getTransactionByYearsRange(),
		]);

		return {
			cfyear: deps.cfyear ?? today.getFullYear(),
			transactions,
			cashflow,
			yearsRange,
		};
	},
});

function RouteComponent() {
	const { cfyear, transactions, cashflow, yearsRange } = Route.useLoaderData();
	return (
		<div className="max-w-7xl mx-auto py-5">
			<h1 className="text-4xl font-semibold">Dashboard</h1>
			<Cashflow
				year={cfyear}
				yearsRange={yearsRange}
				annualCachflow={cashflow}
			/>
			<RecentTransactions transactions={transactions} />
		</div>
	);
}
