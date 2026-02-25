import { Link, useRouter } from '@tanstack/react-router';
import { format } from 'date-fns';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { TransactionGetWithCategoryDto } from '@/types/transaction';

interface AllTransactionProps {
	yearsRange: number[];
	month: number;
	year: number;
	transactions: TransactionGetWithCategoryDto[];
}

export function AllTransactions({
	month,
	year,
	yearsRange,
	transactions,
}: AllTransactionProps) {
	const router = useRouter();
	const [selectedYear, setSelectedYear] = useState(year);
	const [selectedMonth, setSelectedMonth] = useState(month);
	const selectedDate = new Date(year, month - 1, 1);
	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex justify-between">
					<span>{format(selectedDate, 'MM yyyy')} Transactions</span>
					<div className="flex gap-1">
						<Select
							value={selectedMonth.toString()}
							onValueChange={(value) => setSelectedMonth(Number(value))}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 12 }).map((_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<SelectItem key={i} value={`${i + 1}`}>
										{format(new Date(selectedDate.getFullYear(), i, 1), 'MMM')}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={selectedYear.toString()}
							onValueChange={(value) => setSelectedYear(Number(value))}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{yearsRange.map((year) => (
									<SelectItem key={year} value={year.toString()}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button asChild>
							<Link
								to="/dashboard/transactions"
								search={{
									month: selectedMonth,
									year: selectedYear,
								}}
							>
								Go
							</Link>
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Button asChild>
					<Link to="/dashboard/transactions/new">New Transaction</Link>
				</Button>
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
									<TableCell className="text-right">
										<Button
											variant="outline"
											size="icon"
											aria-label="Edit transaction"
											asChild
										>
											<Link
												onClick={() => {
													router.clearCache({
														filter: (route) =>
															route.pathname !==
															`/dashboard/transactions/${transaction.id}`,
													});
												}}
												to="/dashboard/transactions/$transactionId"
												params={{ transactionId: transaction.id.toString() }}
											>
												<PencilIcon />
											</Link>
										</Button>
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
