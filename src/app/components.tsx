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

export function ButtonThing({ buttonText, onClick }: { buttonText: string; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
    >
      {buttonText}
    </Button>
  )
}


export function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-96 max-w-full rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-xl text-gray-500 hover:text-black"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}