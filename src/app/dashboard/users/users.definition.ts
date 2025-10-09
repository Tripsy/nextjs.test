import {UserModel, UserRoleEnum} from '@/lib/models/user.model';
import {LanguageEnum} from '@/lib/enums';
import {z} from 'zod';
import {lang} from '@/config/lang';
import {cfg} from '@/config/settings';
import {DataTableFilterMetaData} from 'primereact/datatable';
import {DataSourceType, DataTableColumnType} from '@/config/data-source';
import {
    CapitalizeBodyTemplate,
    DateBodyTemplate,
    StatusBodyTemplate
} from '@/app/dashboard/_components/data-table-row.component';
import {
    findUsers
} from '@/lib/services/users.service';
import {FormSituationType} from '@/lib/types';

export type DataTableFiltersUsersType = {
    global: DataTableFilterMetaData;
    role: DataTableFilterMetaData;
    status: DataTableFilterMetaData;
    create_date_start: DataTableFilterMetaData;
    create_date_end: DataTableFilterMetaData;
    is_deleted: DataTableFilterMetaData;
};

export type FormFieldsUsersType = {
    name: string;
    email: string;
    password?: string;
    password_confirm?: string;
    language: LanguageEnum;
    role: UserRoleEnum;
};

export type FormStateUsersType = {
    dataSource: keyof DataSourceType;
    id?: number;
    values: FormFieldsUsersType;
    errors: Partial<Record<keyof FormFieldsUsersType, string[]>>;
    message: string | null;
    situation: FormSituationType;
};

export const FormStateUsers: FormStateUsersType = {
    dataSource: 'users',
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
    situation: null
};

const ValidateSchemaBaseUsers = z.object({
    name: z
        .string({
            message: lang('users.validation.name_invalid')
        })
        .min(parseInt(cfg('user.nameMinLength')), {
            message: lang('users.validation.name_min', {min: cfg('user.nameMinLength')}),
        })
        .trim(),
    email: z
        .string({
            message: lang('users.validation.email_invalid')
        })
        .email({
            message: lang('users.validation.email_invalid')
        })
        .trim(),
    language: z
        .nativeEnum(LanguageEnum, {message: lang('users.validation.language_invalid')}),
    role: z
        .nativeEnum(UserRoleEnum, {message: lang('users.validation.role_invalid')}),
});

const ValidateSchemaCreateUsers = ValidateSchemaBaseUsers.extend({
    password: z
        .string({message: lang('users.validation.password_invalid')})
        .min(parseInt(cfg('user.passwordMinLength')), {
            message: lang('users.validation.password_min', {min: cfg('user.passwordMinLength')}),
        })
        .refine((value) => /[A-Z]/.test(value), {
            message: lang('users.validation.password_condition_capital_letter'),
        })
        .refine((value) => /[0-9]/.test(value), {
            message: lang('users.validation.password_condition_number'),
        })
        .refine((value) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), {
            message: lang('users.validation.password_condition_special_character'),
        }),
    password_confirm: z
        .string({
            message: lang('users.validation.password_confirm_required')
        })
        .nonempty({
            message: lang('users.validation.password_confirm_required')
        })
        .trim(),
}).superRefine(({password, password_confirm}, ctx) => {
    if (password !== password_confirm) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password_confirm"],
            message: "Passwords do not match",
        });
    }
});

const ValidateSchemaUpdateUsers = ValidateSchemaBaseUsers.extend({
    password: z
        .string({message: lang('users.validation.password_invalid')})
        .min(parseInt(cfg('user.passwordMinLength')), {
            message: lang('users.validation.password_min', {min: cfg('user.passwordMinLength')}),
        })
        .refine((value) => /[A-Z]/.test(value), {
            message: lang('users.validation.password_condition_capital_letter'),
        })
        .refine((value) => /[0-9]/.test(value), {
            message: lang('users.validation.password_condition_number'),
        })
        .refine((value) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), {
            message: lang('users.validation.password_condition_special_character'),
        })
        .optional(),
    password_confirm: z
        .string({
            message: lang('users.validation.password_confirm_required')
        })
        .trim()
        .optional(),
}).superRefine(({password, password_confirm}, ctx) => {
    if (password || password_confirm) {
        if (!password_confirm) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["password_confirm"],
                message: lang('users.validation.password_confirm_required'),
            });
        } else if (password !== password_confirm) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["password_confirm"],
                message: lang('users.validation.password_confirm_mismatch'),
            });
        }
    }
});

type ValidationResultUsersType =
    | z.SafeParseReturnType<FormFieldsUsersType, z.infer<typeof ValidateSchemaCreateUsers>>
    | z.SafeParseReturnType<FormFieldsUsersType, z.infer<typeof ValidateSchemaUpdateUsers>>;

export function validateFormUsers(values: FormFieldsUsersType, id?: number): ValidationResultUsersType {
    if (id) {
        return ValidateSchemaUpdateUsers.safeParse(values);
    }
    
    return ValidateSchemaCreateUsers.safeParse(values);
}

function getFormValuesUsers(formData: FormData): FormFieldsUsersType {
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

export type DataSourceUsersType = {
    dataTableFilter: DataTableFiltersUsersType;
    model: UserModel;
    formState: FormStateUsersType;
    validationResult: ValidationResultUsersType;
};

const DataTableColumnsUsers: DataTableColumnType<UserModel>[] = [
    {field: 'id', header: 'ID', sortable: true},
    {field: 'name', header: 'Name', sortable: true},
    {field: 'email', header: 'Email'},
    {field: 'role', header: 'Role', body: CapitalizeBodyTemplate},
    {field: 'status', header: 'Status', body: StatusBodyTemplate, style: {maxWidth: '6rem'}},
    {field: 'created_at', header: 'Created At', sortable: true, body: DateBodyTemplate},
];

export const DataSourceConfigUsers = {
    dataTableState: {
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: -1 as const,
        filters: {
            global: {value: null, matchMode: 'contains' as const},
            role: {value: null, matchMode: 'equals' as const},
            status: {value: null, matchMode: 'equals' as const},
            create_date_start: {value: null, matchMode: 'equals' as const},
            create_date_end: {value: null, matchMode: 'equals' as const},
            is_deleted: {value: null, matchMode: 'equals' as const},
        }
    },
    dataTableColumns: DataTableColumnsUsers,
    onRowSelect: (entry: UserModel) => console.log('selected', entry),
    onRowUnselect: (entry: UserModel) => console.log('unselected', entry),    
    findFunction: findUsers,
    // TODO
    // createFunction: createUsers,
    // updateFunction: updateUsers,
    // deleteFunction: deleteUsers,
    getFormValuesFunction: getFormValuesUsers,
    validateFormFunction: validateFormUsers,
}