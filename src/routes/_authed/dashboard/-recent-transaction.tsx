import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { TransactionGetWithCategoryDto } from '@/types/transaction';

interface RecentTransactionsProps {
	transactions: TransactionGetWithCategoryDto[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between">
					<span>Recent Transactions</span>
					<div className="flex gap-2">
						<Button asChild variant="outline">
							<Link to="/dashboard/transactions">View All</Link>
						</Button>
						<Button asChild variant="outline">
							<Link to="/dashboard/transactions/new">Create New</Link>
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{!transactions || transactions.length === 0 ? (
					<p className="text-center py-10 text-lg text-muted-foreground">
						There are no transactoins for this month.
					</p>
				) : (
					<Table className="mt-4">
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>
										{format(transaction.transactionDate, 'do MM yyyy')}
									</TableCell>
									<TableCell>{transaction.description}</TableCell>
									<TableCell className="capitalize">
										<Badge
											className={
												transaction.transactionType === 'income'
													? 'bg-lime-500'
													: 'bg-orange-500'
											}
										>
											{transaction.transactionType}
										</Badge>
									</TableCell>
									<TableCell>{transaction.category}</TableCell>
									<TableCell>
										{Intl.NumberFormat('ja-JP', {
											style: 'currency',
											currency: 'JPY',
										}).format(transaction.amount)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
