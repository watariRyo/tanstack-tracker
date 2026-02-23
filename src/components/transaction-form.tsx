import { useForm } from '@tanstack/react-form';

import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useId } from 'react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import type { CategoryDto } from '@/types/category';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from './ui/field';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

export const transactionFormSchema = z.object({
	transactionType: z.enum(['income', 'expense']),
	categoryId: z.number().positive('Please select a category.'),
	transactionDate: z
		.date()
		.max(addDays(new Date(), 1), 'Transaction date cannot be in the future.'),
	amount: z.number().positive('Amount must be a positive number.'),
	description: z
		.string()
		.min(3, 'Description must be at least 3 characters long.')
		.max(255, 'Description cannot exceed 255 characters.')
		.or(z.literal('')),
});

interface TransactionFormProps {
	categories: CategoryDto[];
	onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
}

export function TransactionForm({
	categories,
	onSubmit,
}: TransactionFormProps) {
	const formId = useId();
	const transactionTypeId = useId();
	const categoryId = useId();
	const transactionDateId = useId();
	const amountId = useId();
	const descriptionId = useId();
	const form = useForm({
		defaultValues: {
			transactionType: 'income',
			categoryId: 0,
			transactionDate: new Date(),
			amount: 0,
			description: '' as string | undefined,
		},
		validators: {
			onChange: transactionFormSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value as z.infer<typeof transactionFormSchema>);
		},
	});

	return (
		<form
			id={formId}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<fieldset
					className="grid grid-cols-2 gap-y-5 gap-x-2"
					disabled={form.state.isSubmitting}
				>
					<form.Field name="transactionType">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldContent>
										<FieldLabel htmlFor={transactionTypeId}>
											Transaction Type
										</FieldLabel>
									</FieldContent>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
									<Select
										name={field.name}
										value={(field.state.value as string) || ''}
										onValueChange={field.handleChange}
									>
										<SelectTrigger
											id={transactionTypeId}
											aria-invalid={isInvalid}
										>
											<SelectValue placeholder="Transaction Type" />
										</SelectTrigger>
										<SelectContent position="item-aligned">
											<SelectItem value="income">Income</SelectItem>
											<SelectItem value="expense">Expense</SelectItem>
										</SelectContent>
									</Select>
								</Field>
							);
						}}
					</form.Field>
					<form.Field name="categoryId">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<form.Subscribe
									selector={(state) => state.values.transactionType}
								>
									{(transactionType) => {
										const filteredCategories = categories.filter(
											(category) => category.type === transactionType,
										);
										return (
											<Field data-invalid={isInvalid}>
												<FieldContent>
													<FieldLabel htmlFor={categoryId}>Category</FieldLabel>
												</FieldContent>
												{isInvalid && (
													<FieldError errors={field.state.meta.errors} />
												)}
												<Select
													name={field.name}
													value={field.state.value?.toString() || ''}
													onValueChange={(value) =>
														field.handleChange(Number(value))
													}
												>
													<SelectTrigger
														id={categoryId}
														aria-invalid={isInvalid}
													>
														<SelectValue placeholder="Category" />
													</SelectTrigger>
													<SelectContent position="item-aligned">
														{filteredCategories.map((category) => (
															<SelectItem
																key={category.id}
																value={category.id.toString()}
															>
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
										);
									}}
								</form.Subscribe>
							);
						}}
					</form.Field>
					<form.Field name="transactionDate">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldContent>
										<FieldLabel htmlFor={transactionDateId}>
											Transaction Date
										</FieldLabel>
									</FieldContent>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={'outline'}
												className={cn(
													'w-70 justify-start text-left font-normal',
													!field.state.value && 'text-muted-foreground',
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.state.value ? (
													format(field.state.value, 'PPP')
												) : (
													<span>Pick a date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												required
												selected={field.state.value}
												onSelect={field.handleChange}
												autoFocus
												disabled={{ after: new Date() }}
											/>
										</PopoverContent>
									</Popover>
								</Field>
							);
						}}
					</form.Field>
					<form.Field name="amount">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldContent>
										<FieldLabel htmlFor={amountId}>Amount</FieldLabel>
									</FieldContent>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
									<Input
										id={amountId}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										onBlur={field.handleBlur}
										type="number"
										step={0.01}
										aria-invalid={isInvalid}
									/>
								</Field>
							);
						}}
					</form.Field>
				</fieldset>
				<fieldset
					disabled={form.state.isSubmitting}
					className="flex flex-col gap-5"
				>
					<form.Field name="description">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldContent>
										<FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
									</FieldContent>
									<Input
										id={descriptionId}
										name={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										type="text"
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
					<Button type="submit">
						{form.state.isSubmitting ? 'Submitting...' : 'Submit'}
					</Button>
				</fieldset>
			</FieldGroup>
		</form>
	);
}
