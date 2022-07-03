import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { FormBuilder } from './form'
import { Controller } from 'react-hook-form'
import * as z from 'zod'

export default {
	title: 'Form Builder',
	parameters: {
		// More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
		layout: 'fullscreen',
	},
}
const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
}
const SampleForm = FormBuilder({
	email: (name) => () => {
		return (
			<Controller
				name={name}
				render={(field) => {
					return (
						<div>
							<input {...field.field} type={'text'}></input>
							{field.fieldState.error?.message || null}
						</div>
					)
				}}
				rules={{
					validate: {
						EMAIL: (c) => {
							if (validateEmail(c)) {
								return true
							}
							return 'Invalid email field'
						},
					},
				}}
			></Controller>
		)
	},
})

const UserEmailForm = SampleForm.build({
	email: 'email',
	email2: 'email',
	email3: 'email',
})

function FormHandle(props: React.PropsWithChildren<{}>) {
	const form = UserEmailForm.useForm()
	return (
		<form
			onSubmit={form.handleSubmit((c) => {
				z.object({
					email: z.string(),
				})
				return [{}]
			})}
		>
			{props.children}
		</form>
	)
}

export const FormInput = () => {
	return (
		<UserEmailForm.Form>
			<FormHandle>
				<UserEmailForm.EmailField />
				<UserEmailForm.Email3Field />
				<UserEmailForm.EmailField />
				<button type={'submit'}>Submit</button>
			</FormHandle>
		</UserEmailForm.Form>
	)
}
