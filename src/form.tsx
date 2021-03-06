import React from 'react'
import * as P from 'ts-prime'
import { FormProvider, useForm, useFormContext, UseFormReturn } from 'react-hook-form'

type FormElement = (name: string) => (props: any) => JSX.Element

interface Field {
	value: string
	dirty?: boolean
	valid?: boolean
}

interface ValidationError<F extends string> {
	field: F
	message: string
}

function makeFormComponent<T extends Record<string, unknown>>() {
	return (
		props: React.PropsWithChildren<{
			onBlur?: (result: T) => ValidationError<Extract<keyof T, string>>[]
			onSubmit?: (result: T) => ValidationError<Extract<keyof T, string>>[]
			onChange?: (result: T) => ValidationError<Extract<keyof T, string>>[]
		}>
	) => {
		const form = useForm()

		return <FormProvider {...form}>{props.children}</FormProvider>
	}
}


type ComponentNames<R extends { [k: string]: ReturnType<FormElement> }> = {
	[k in keyof R]: { name: `${Capitalize<Extract<k, string>>}Field`; component: R[k] }
}[keyof R]

type WithReactComponentNames<R extends { [k: string]: ReturnType<FormElement> }> = {
	[k in ComponentNames<R>['name']]: Extract<ComponentNames<R>, { name: k }>['component']
}
export function FormBuilder<T extends { [k: string]: FormElement }>(elements: T) {
	return {
		build<Fields extends { [k: string]: keyof T }>(
			fields: Fields
		): WithReactComponentNames<{ [k in keyof Fields]: ReturnType<T[Fields[k]]> }> & {
			useForm(): UseFormReturn<{ [k in keyof Fields]?: string }, any>
			Form: (
				props: React.PropsWithChildren<{
					onSubmit?: (result: {
						fields: { [k in keyof Fields]?: string }
					}) => ValidationError<Extract<keyof Fields, string>>[]
					onChange?: (result: {
						fields: { [k in keyof Fields]: Field }
					}) => ValidationError<Extract<keyof Fields, string>>[]
				}>
			) => JSX.Element
		} {
			return {
				useForm() {
					return useFormContext()
				},
				...P.mapRecord(fields, ([k, v]) => [P.capitalize(k.toString()), elements[v](k.toString())]),
				Form: makeFormComponent<{ [k in keyof Fields]?: string }>(),
			} as any
		},
	}
}
