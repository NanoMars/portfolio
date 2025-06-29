"use client";

import { Description, Field, Input, Label, Textarea, Button } from '@headlessui/react'
import { logoutAction } from "./actions";
import { useActionState } from "react";
import clsx from "clsx";

const initialState = {
	message: ""
};

export function LogoutButton() {
	const [_, action] = useActionState(logoutAction, initialState);
	return (
		<form action={action}>
			<button>Sign out</button>
		</form>
	);
}

export function InputField({ fieldName, fieldDescription }: { fieldName: string; fieldDescription: string }) {
	return (
		<div className="w-full max-w-md px-4">
			<Field>
				<Label className="text-sm/6 font-medium text-black">{fieldName}</Label>
				<Description className="text-sm/6 text-black/50">{fieldDescription}</Description>
				<Input
					className={clsx(
						'mt-3 block w-full rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
						'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
					)}
				/>
			</Field>
		</div>
	);
}

export function TextField({ fieldName, fieldDescription }: { fieldName: string; fieldDescription: string }) {
  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-black">{fieldName}</Label>
        <Description className="text-sm/6 text-black/50">{fieldDescription}</Description>
        <Textarea
          className={clsx(
            'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 px-3 py-1.5 text-sm/6 text-black',
            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black/25'
          )}
          rows={3}
        />
      </Field>
    </div>
  )
}

export function ButtonThing({ buttonText }: { buttonText: string }) {
  return (
    <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
      {buttonText}
    </Button>
  )
}