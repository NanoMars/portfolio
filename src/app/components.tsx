"use client";

import { Description, Field, Input, Label } from '@headlessui/react'
import { logoutAction } from "./actions";
import { useFormState } from "react-dom";
import clsx from "clsx";

const initialState = {
	message: ""
};

export function LogoutButton() {
	const [, action] = useFormState(logoutAction, initialState);
	return (
		<form action={action}>
			<button>Sign out</button>
		</form>
	);
}

export default function InputField({ fieldName, fieldDescription }: { fieldName: string; fieldDescription: string }) {
	return (
		<div className="w-full max-w-md px-4">
			<Field>
				<Label className="text-sm/6 font-medium text-white">{fieldName}</Label>
				<Description className="text-sm/6 text-white/50">{fieldDescription}</Description>
				<Input
					className={clsx(
						'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
						'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
					)}
				/>
			</Field>
		</div>
	);
}