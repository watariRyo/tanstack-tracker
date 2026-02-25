import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from '@clerk/tanstack-react-start';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChartColumnBigIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
	const navigate = useNavigate();
	return (
		<>
			<Link to="/" className="flex gap-1 items-center font-bold text-2xl">
				<ChartColumnBigIcon className="text-lime-500" /> Tracker
			</Link>
			<SignedOut>
				<div className="text-white flex items-center">
					<Button asChild variant="link" className="text-white">
						<SignInButton />
					</Button>
					<div className="w-px h-8 bg-zinc-700" />
					<Button asChild variant="link" className="text-white">
						<SignUpButton />
					</Button>
				</div>
			</SignedOut>
			<SignedIn>
				<UserButton
					showName
					appearance={{
						elements: {
							userButtonAvatarBox: {
								border: '1px solid white',
							},
							userButtonOuterIdentifier: {
								color: 'white',
							},
						},
					}}
				>
					<UserButton.MenuItems>
						<UserButton.Action
							label="Dashboard"
							labelIcon={<ChartColumnBigIcon />}
							onClick={() => {
								navigate({ to: '/dashboard' });
							}}
						/>
					</UserButton.MenuItems>
				</UserButton>
			</SignedIn>
		</>
	);
}
