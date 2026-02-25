import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { CashFlowDto } from '@/types/transaction';

interface CashflowProps {
	year: number;
	yearsRange: number[];
	annualCachflow: CashFlowDto[];
}

export function Cashflow({ year, yearsRange, annualCachflow }: CashflowProps) {
	const totalAnnualIncome = annualCachflow.reduce(
		(acc, current) => acc + current.income,
		0,
	);
	const totalAnnualExpenses = annualCachflow.reduce(
		(acc, current) => acc + current.expense,
		0,
	);
	const balance = totalAnnualIncome - totalAnnualExpenses;

	const navigate = useNavigate();
	return (
		<Card className="mb-5">
			<CardHeader>
				<CardTitle className="flex justify-between">
					<span>Cashflow</span>
					<div>
						<Select
							defaultValue={year.toString()}
							onValueChange={(value) => {
								navigate({
									to: '/dashboard',
									search: {
										cfyear: Number(value),
									},
								});
							}}
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
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-[1fr_250px]">
				<ChartContainer
					config={{
						income: {
							label: 'Income',
							color: '#84cc16',
						},
						expense: {
							label: 'Expense',
							color: '#f97316',
						},
					}}
					className="w-full h-75"
				>
					<BarChart data={annualCachflow}>
						<CartesianGrid vertical={false} />
						<YAxis
							tickFormatter={(value) => {
								return Intl.NumberFormat('ja-JP', {
									style: 'currency',
									currency: 'JPY',
								}).format(value);
							}}
						/>
						<XAxis
							dataKey="month"
							tickFormatter={(value) => {
								return format(new Date(year, value, 1), 'MMM');
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									labelFormatter={(_, payload) => {
										return (
											<div>
												{format(
													new Date(year, payload[0]?.payload?.month),
													'MMM',
												)}
											</div>
										);
									}}
								/>
							}
						/>
						<Legend align="right" verticalAlign="top" />
						<Bar dataKey="income" fill="var(--color-income)" radius={4} />
						<Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
					</BarChart>
				</ChartContainer>
				<div className="border-l px-4 flex flex-col gap-4 justify-center">
					<div>
						<span className="text-muted-foreground font-bold text-sm">
							Income
						</span>
						<h2 className="text-3xl">
							{Intl.NumberFormat('ja-JP', {
								style: 'currency',
								currency: 'JPY',
							}).format(totalAnnualIncome)}
						</h2>
					</div>
					<div className="border-t" />
					<div>
						<span className="text-muted-foreground font-bold text-sm">
							Expenses
						</span>
						<h2 className="text-3xl">
							{Intl.NumberFormat('ja-JP', {
								style: 'currency',
								currency: 'JPY',
							}).format(totalAnnualExpenses)}
						</h2>
					</div>
					<div className="border-t" />
					<div>
						<span className="text-muted-foreground font-bold text-sm">
							Balance
						</span>
						<h2
							className={cn(
								'text-3xl font-bold',
								balance >= 0 ? 'text-lime-500' : 'text-orange-500',
							)}
						>
							{Intl.NumberFormat('ja-JP', {
								style: 'currency',
								currency: 'JPY',
							}).format(balance)}
						</h2>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
