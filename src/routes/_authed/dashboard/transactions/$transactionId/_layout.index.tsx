import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type z from 'zod';
import {
	TransactionForm,
	type transactionFormSchema,
} from '@/components/transaction-form';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteTransaction } from '@/data/delete-transaction';
import { getCategories } from '@/data/get-categories';
import { getTransactionById } from '@/data/get-transaction-by-id';
import { updateTransaction } from '@/data/update-transaction';

export const Route = createFileRoute(
	'/_authed/dashboard/transactions/$transactionId/_layout/',
)({
	component: RouteComponent,
	errorComponent: () => {
		return (
			<div className="text-3xl text-muted-foreground">
				Oops! Transaction not found.
			</div>
		);
	},
	loader: async ({ params }) => {
		const [categories, transaction] = await Promise.all([
			getCategories(),
			getTransactionById({
				data: {
					transactionId: Number(params.transactionId),
				},
			}),
		]);

		console.log('Transaction:', transaction);

		if (!transaction) {
			throw new Error('Transaction not found.');
		}

		return { categories, transaction };
	},
});

function RouteComponent() {
	const [deleting, setDeleting] = useState(false);
	const { categories, transaction } = Route.useLoaderData();
	const navigate = useNavigate();

	const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
		await updateTransaction({
			data: {
				id: Number(transaction.id),
				amount: data.amount,
				categoryId: data.categoryId,
				description: data.description,
				transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
			},
		});

		toast.success('Transaction update successfully!', {
			style: {
				background: '#4CAF50',
				color: 'white',
			},
			position: 'bottom-right',
		});

		navigate({
			to: '/dashboard/transactions',
			search: {
				month: data.transactionDate.getMonth() + 1,
				year: data.transactionDate.getFullYear(),
			},
		});
	};

	const handleDeleteConfirm = async () => {
		setDeleting(true);
		await deleteTransaction({
			data: {
				transactionId: Number(transaction.id),
			},
		});

		toast.success('Transaction delete successfully!', {
			style: {
				background: '#4CAF50',
				color: 'white',
			},
			position: 'bottom-right',
		});

		setDeleting(false);

		navigate({
			to: '/dashboard/transactions',
			search: {
				month: transaction.transactionDate.getMonth() + 1,
				year: transaction.transactionDate.getFullYear(),
			},
		});
	};

	return (
		<Card className="max-w-3xl mt-4">
			<CardHeader>
				<CardTitle className="flex justify-between">
					<span>Edit Transaction</span>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="icon">
								<Trash2Icon />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action canmot be undone. This transaction will be
									permanently deleted.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<Button
									disabled={deleting}
									onClick={handleDeleteConfirm}
									variant="destructive"
								>
									Delete
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<TransactionForm
					categories={categories}
					onSubmit={handleSubmit}
					defaultValues={{
						amount: transaction.amount,
						categoryId: transaction.categoryId,
						description: transaction.description,
						transactionDate: new Date(transaction.transactionDate),
						transactionType: categories.find(
							(category) => category.id === transaction.categoryId,
						)?.type,
					}}
				/>
			</CardContent>
		</Card>
	);
}
