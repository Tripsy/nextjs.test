import type { DataTableFilterMetaData } from 'primereact/datatable';
import { z } from 'zod';
import {
	CapitalizeBodyTemplate,
	DateBodyTemplate,
	StatusBodyTemplate,
} from '@/app/dashboard/_components/data-table-row.component';
import type { DataTableColumnType, FormStateType } from '@/config/data-source';
import { lang } from '@/config/lang';
import { cfg } from '@/config/settings';
import { LanguageEnum } from '@/lib/enums';
import {
	type UserModel,
	UserRoleEnum,
	UserStatusEnum,
} from '@/lib/models/user.model';
import {
	createUsers,
	deleteUsers, disableUsers, enableUsers,
	findUsers, restoreUsers,
	updateUsers,
} from '@/lib/services/users.service';

export type DataTableFiltersUsersType = {
	global: DataTableFilterMetaData;
	role: DataTableFilterMetaData;
	status: DataTableFilterMetaData;
	create_date_start: DataTableFilterMetaData;
	create_date_end: DataTableFilterMetaData;
	is_deleted: DataTableFilterMetaData;
};

export type FormValuesUsersType = {
	name: string;
	email: string;
	password?: string;
	password_confirm?: string;
	language: LanguageEnum;
	role: UserRoleEnum;
};

const ValidateSchemaBaseUsers = z.object({
	name: z
		.string({ message: lang('users.validation.name_invalid') })
		.trim()
		.min(parseInt(cfg('user.nameMinLength')), {
			message: lang('users.validation.name_min', {
				min: cfg('user.nameMinLength'),
			}),
		}),
	email: z
		.string({ message: lang('users.validation.email_invalid') })
		.trim()
		.email({
			message: lang('users.validation.email_invalid'),
		}),
	language: z.nativeEnum(LanguageEnum, {
		message: lang('users.validation.language_invalid'),
	}),
	role: z.nativeEnum(UserRoleEnum, {
		message: lang('users.validation.role_invalid'),
	}),
});

const ValidateSchemaCreateUsers = ValidateSchemaBaseUsers.extend({
	password: z
		.string({ message: lang('users.validation.password_invalid') })
		.trim()
		.min(parseInt(cfg('user.passwordMinLength')), {
			message: lang('users.validation.password_min', {
				min: cfg('user.passwordMinLength'),
			}),
		})
		.refine((value) => /[A-Z]/.test(value), {
			message: lang('users.validation.password_condition_capital_letter'),
		})
		.refine((value) => /[0-9]/.test(value), {
			message: lang('users.validation.password_condition_number'),
		})
		.refine((value) => /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value), {
			message: lang(
				'users.validation.password_condition_special_character',
			),
		}),
	password_confirm: z
		.string({ message: lang('users.validation.password_confirm_required') })
		.trim()
		.nonempty({
			message: lang('users.validation.password_confirm_required'),
		}),
}).superRefine(({ password, password_confirm }, ctx) => {
	if (password !== password_confirm) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['password_confirm'],
			message: 'Passwords do not match',
		});
	}
});

const ValidateSchemaUpdateUsers = ValidateSchemaBaseUsers.extend({
	password: z.preprocess(
		(val) => (val === '' ? undefined : val),
		z
			.string({ message: lang('users.validation.password_invalid') })
			.trim()
			.min(parseInt(cfg('user.passwordMinLength')), {
				message: lang('users.validation.password_min', {
					min: cfg('user.passwordMinLength').toString(),
				}),
			})
			.refine((value) => /[A-Z]/.test(value), {
				message: lang(
					'users.validation.password_condition_capital_letter',
				),
			})
			.refine((value) => /[0-9]/.test(value), {
				message: lang('users.validation.password_condition_number'),
			})
			.refine((value) => /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value), {
				message: lang(
					'users.validation.password_condition_special_character',
				),
			})
			.optional(),
	),
	password_confirm: z.preprocess(
		(val) => (val === '' ? undefined : val),
		z
			.string({
				message: lang('users.validation.password_confirm_required'),
			})
			.trim()
			.optional(),
	),
}).superRefine(({ password, password_confirm }, ctx) => {
	if (password || password_confirm) {
		if (!password_confirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['password_confirm'],
				message: lang('users.validation.password_confirm_required'),
			});
		} else if (password !== password_confirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['password_confirm'],
				message: lang('users.validation.password_confirm_mismatch'),
			});
		}
	}
});

type ValidationResultUsersType =
	| z.SafeParseReturnType<
			FormValuesUsersType,
			z.infer<typeof ValidateSchemaCreateUsers>
	  >
	| z.SafeParseReturnType<
			FormValuesUsersType,
			z.infer<typeof ValidateSchemaUpdateUsers>
	  >;

function validateFormUsers(
	values: FormValuesUsersType,
	id?: number,
): ValidationResultUsersType {
	if (id) {
		console.log('ValidateSchemaUpdateUsers');
		return ValidateSchemaUpdateUsers.safeParse(values);
	}

	console.log('ValidateSchemaCreateUsers');

	return ValidateSchemaCreateUsers.safeParse(values);
}

function getFormValuesUsers(formData: FormData): FormValuesUsersType {
	const language = formData.get('language');
	const validLanguages = Object.values(LanguageEnum);

	const role = formData.get('role');
	const validRoles = Object.values(UserRoleEnum);

	return {
		name: formData.get('name') as string,
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		password_confirm: formData.get('password_confirm') as string,
		language: validLanguages.includes(language as LanguageEnum)
			? (language as LanguageEnum)
			: LanguageEnum.EN,
		role: validRoles.includes(role as UserRoleEnum)
			? (role as UserRoleEnum)
			: UserRoleEnum.MEMBER,
	};
}

function syncFormStateUsers (
	state: FormStateType<'users'>,
	model: UserModel,
): FormStateType<'users'> {
	return {
		...state,
		id: model.id,
		values: {
			...state.values,
			name: model.name,
			email: model.email,
			language: model.language,
			role: model.role,
		},
	};
}

function getActionContentEntriesUsers(entries: UserModel[]) {
	return entries.map(entry => ({id: entry.id, label: entry.name}));
}

export type DataSourceUsersType = {
	dataTableFilter: DataTableFiltersUsersType;
	model: UserModel;
	formState: FormStateType<'users'>;
	formValues: FormValuesUsersType;
	validationResult: ValidationResultUsersType;
};

const DataTableColumnsUsers: DataTableColumnType<UserModel>[] = [
	{ field: 'id', header: 'ID', sortable: true },
	{ field: 'name', header: 'Name', sortable: true },
	{ field: 'email', header: 'Email' },
	{ field: 'role', header: 'Role', body: CapitalizeBodyTemplate },
	{
		field: 'status',
		header: 'Status',
		body: StatusBodyTemplate,
		style: { maxWidth: '6rem' },
	},
	{
		field: 'created_at',
		header: 'Created At',
		sortable: true,
		body: DateBodyTemplate,
	},
];

const DataTableFiltersUsers: DataTableFiltersUsersType = {
	global: { value: null, matchMode: 'contains' },
	role: { value: null, matchMode: 'equals' },
	status: { value: null, matchMode: 'equals' },
	create_date_start: { value: null, matchMode: 'equals' },
	create_date_end: { value: null, matchMode: 'equals' },
	is_deleted: { value: null, matchMode: 'equals' },
};

export const DataSourceConfigUsers = {
	dataTableState: {
		reloadTrigger: 0,
		first: 0,
		rows: 10,
		sortField: 'id',
		sortOrder: -1 as const,
		filters: DataTableFiltersUsers,
	},
	dataTableColumns: DataTableColumnsUsers,
	formState: {
		dataSource: 'users' as const,
		id: undefined,
		values: {
			name: '',
			email: '',
			password: '',
			password_confirm: '',
			language: LanguageEnum.EN,
			role: UserRoleEnum.MEMBER,
		},
		errors: {},
		message: null,
		situation: null,
	},
	functions: {
		find: findUsers,
		// onRowSelect: (entry: UserModel) => console.log('selected', entry),
		// onRowUnselect: (entry: UserModel) => console.log('unselected', entry),
		getFormValues: getFormValuesUsers,
		validateForm: validateFormUsers,
		syncFormState: syncFormStateUsers,
		getActionContentEntries: getActionContentEntriesUsers,
	},
	actions: {
		create: {
			permission: 'user.create',
			allowedEntries: 'free' as const,
			position: 'right' as const,
			function: createUsers,
			button: {
				className: 'btn btn-action-create',
			},
		},
		update: {
			permission: 'user.update',
			allowedEntries: 'single' as const,
			position: 'left' as const,
			function: updateUsers,
			button: {
				className: 'btn btn-action-update',
			},
		},
		delete: {
			permission: 'user.delete',
			allowedEntries: 'single' as const,
			entryCustomCheck: (entry: UserModel) => !entry.deleted_at, // Return true if entry is not deleted
			position: 'left' as const,
			function: deleteUsers,
			button: {
				className: 'btn btn-action-delete',
			},
		},
		enable: {
			permission: 'user.update',
			allowedEntries: 'single' as const,
			entryCustomCheck: (entry: UserModel) =>
				!entry.deleted_at &&
				[UserStatusEnum.PENDING, UserStatusEnum.INACTIVE].includes(
					entry.status,
				),
			position: 'left' as const,
			function: enableUsers,
			button: {
				className: 'btn btn-action-enable',
			},
		},
		disable: {
			permission: 'user.update',
			allowedEntries: 'single' as const,
			entryCustomCheck: (entry: UserModel) =>
				!entry.deleted_at &&
				[UserStatusEnum.PENDING, UserStatusEnum.ACTIVE].includes(
					entry.status,
				),
			position: 'left' as const,
			function: disableUsers,
			button: {
				className: 'btn btn-action-disable',
			},
		},
		restore: {
			permission: 'user.delete',
			allowedEntries: 'single' as const,
			entryCustomCheck: (entry: UserModel) => !!entry.deleted_at, // Return true if entry is deleted
			position: 'left' as const,
			function: restoreUsers,
			button: {
				className: 'btn btn-action-restore',
			},
		},
	},
};
