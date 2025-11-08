import clsx from 'clsx';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type { JSX } from 'react';
import { FormElementError } from '@/components/form/form-element-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';

export type SelectOptionsType<V> = {
	label: string;
	value: V;
}[];

export type HandleChangeType = (
	field: string,
	value: string | boolean | number | Date,
) => void;

export const FormElement = ({
	children,
	labelText,
	labelFor,
	className,
}: {
	children: JSX.Element;
	className?: string;
	labelText?: string;
	labelFor?: string;
}): JSX.Element | null => (
	<div className={clsx('form-element', className)}>
		{labelText &&
			(labelFor ? (
				<label htmlFor={labelFor}>{labelText}</label>
			) : (
				<div className="label-placeholder">{labelText}</div>
			))}
		{children}
	</div>
);

export const FormElementName = ({
	labelText = 'Name',
	placeholderText = 'eg: John Doe',
	id,
	value,
	disabled,
	handleChange,
	error,
}: {
	labelText?: string;
	placeholderText?: string;
	id: string;
	value: string;
	disabled: boolean;
	handleChange: HandleChangeType;
	error?: string[];
}) => (
	<FormPart>
		<FormElement labelText={labelText} labelFor={id}>
			<div>
				<IconField iconPosition="left">
					<InputIcon className="flex items-center">
						<Icons.User className="opacity-60" />
					</InputIcon>
					<InputText
						className="p-inputtext-sm w-full"
						id={id}
						name="name"
						placeholder={placeholderText}
						autoComplete={'name'}
						disabled={disabled}
						invalid={!!error}
						value={value}
						onChange={(e) => handleChange('name', e.target.value)}
					/>
				</IconField>
				<FormElementError messages={error} />
			</div>
		</FormElement>
	</FormPart>
);

export const FormElementEmail = ({
	labelText = 'Email Address',
	placeholderText = 'eg: example@domain.com',
	id,
	value,
	disabled,
	handleChange,
	error,
}: {
	labelText?: string;
	placeholderText?: string;
	id: string;
	value: string;
	disabled: boolean;
	handleChange: HandleChangeType;
	error?: string[];
}) => (
	<FormPart>
		<FormElement labelText={labelText} labelFor={id}>
			<div>
				<IconField iconPosition="left">
					<InputIcon className="flex items-center">
						<Icons.Email className="opacity-60" />
					</InputIcon>
					<InputText
						className="p-inputtext-sm w-full"
						id={id}
						name="email"
						placeholder={placeholderText}
						autoComplete={'email'}
						disabled={disabled}
						invalid={!!error}
						value={value}
						onChange={(e) => handleChange('email', e.target.value)}
					/>
				</IconField>
				<FormElementError messages={error} />
			</div>
		</FormElement>
	</FormPart>
);

export const FormElementPassword = ({
	labelText = 'Password',
	placeholderText = 'Password',
	autoComplete = 'new-password',
	id,
	value,
	disabled,
	handleChange,
	error,
	showPassword,
	setShowPassword,
}: {
	labelText?: string;
	placeholderText?: string;
	autoComplete?: 'current-password' | 'new-password';
	id: string;
	value: string;
	disabled: boolean;
	handleChange: HandleChangeType;
	error?: string[];
	showPassword: boolean;
	setShowPassword: (showPassword: boolean) => void;
}) => (
	<FormPart>
		<FormElement labelText={labelText} labelFor={id}>
			<div>
				<div className="relative">
					<IconField iconPosition="left">
						<InputIcon className="flex items-center">
							<Icons.Password className="opacity-60" />
						</InputIcon>
						<InputText
							className="p-inputtext-sm w-full !pr-10"
							id={id}
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder={placeholderText}
							autoComplete={autoComplete}
							disabled={disabled}
							invalid={!!error}
							value={value}
							onChange={(e) =>
								handleChange('password', e.target.value)
							}
						/>
					</IconField>
					<button
						type="button"
						className="absolute right-3 top-3 focus:outline-none hover:opacity-100 transition-opacity"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={
							showPassword ? 'Hide password' : 'Show password'
						}
					>
						{showPassword ? (
							<Icons.Obscured className="opacity-60 hover:opacity-100 w-4 h-4" />
						) : (
							<Icons.Visible className="opacity-60 hover:opacity-100 w-4 h-4" />
						)}
					</button>
				</div>
				<FormElementError messages={error} />
			</div>
		</FormElement>
	</FormPart>
);

export const FormElementPasswordConfirm = ({
	labelText = 'Confirm Password',
	placeholderText = 'Password confirmation',
	autoComplete = 'new-password',
	id,
	value,
	disabled,
	handleChange,
	error,
	showPassword,
}: {
	labelText?: string;
	placeholderText?: string;
	autoComplete?: 'current-password' | 'new-password';
	id: string;
	value: string;
	disabled: boolean;
	handleChange: HandleChangeType;
	error?: string[];
	showPassword: boolean;
}) => (
	<FormPart>
		<FormElement labelText={labelText} labelFor={id}>
			<div>
				<div className="relative">
					<IconField iconPosition="left">
						<InputIcon className="flex items-center">
							<Icons.Password className="opacity-60" />
						</InputIcon>
						<InputText
							className="p-inputtext-sm w-full !pr-10"
							id={id}
							name="password_confirm"
							type={showPassword ? 'text' : 'password'}
							placeholder={placeholderText}
							autoComplete={autoComplete}
							disabled={disabled}
							invalid={!!error}
							value={value}
							onChange={(e) =>
								handleChange('password_confirm', e.target.value)
							}
						/>
					</IconField>
				</div>
				<FormElementError messages={error} />
			</div>
		</FormElement>
	</FormPart>
);
