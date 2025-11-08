import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
	faArrowRightToBracket,
	faArrowsRotate,
	faBan,
	faBars,
	faCircleCheck,
	faCircleExclamation,
	faCircleInfo,
	faCircleXmark,
	faClock,
	faEnvelope,
	faEye,
	faEyeSlash,
	faKey,
	faLock,
	faMagnifyingGlass,
	faMoon,
	faPenToSquare,
	faPlugCircleXmark,
	faPlus,
	faRotateLeft,
	faScrewdriverWrench,
	faSpinner,
	faSun,
	faThumbsUp,
	faTrashCan,
	faTriangleExclamation,
	faUser,
	faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
	FontAwesomeIcon,
	type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '@/lib/utils/string';

export function AwesomeIcon({
	className = 'w-5 h-5',
	...props
}: FontAwesomeIconProps) {
	return <FontAwesomeIcon className={className} {...props} />;
}

export const Icons = {
	Design: {
		SideMenuOpen: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faBars} {...props} />
		),
		SideMenuClosed: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faBars} {...props} />
		),
		ThemeLight: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faSun} {...props} />
		),
		ThemeDark: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faMoon} {...props} />
		),
		Github: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faGithub} {...props} />
		),
		Linkedin: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faLinkedin} {...props} />
		),
	},
	Loading: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faSpinner} {...props} />
	),
	User: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faUser} {...props} />
	),
	Email: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faEnvelope} {...props} />
	),
	Password: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faKey} {...props} />
	),
	Login: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faArrowRightToBracket} {...props} />
	),
	Register: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faUserCheck} {...props} />
	),
	Error: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faCircleExclamation} {...props} />
	),
	Warning: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faTriangleExclamation} {...props} />
	),
	Info: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faCircleInfo} {...props} />
	),
	Ok: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faThumbsUp} {...props} />
	),
	Success: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faCircleCheck} {...props} />
	),
	Search: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faMagnifyingGlass} {...props} />
	),
	Visible: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faEye} {...props} />
	),
	Obscured: (props: Partial<FontAwesomeIconProps>) => (
		<AwesomeIcon icon={faEyeSlash} {...props} />
	),
	Status: {
		Active: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faCircleCheck} {...props} />
		),
		Pending: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faClock} {...props} />
		),
		Inactive: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faLock} {...props} />
		),
		Deleted: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faBan} {...props} />
		),
		Ok: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faThumbsUp} {...props} />
		),
		Error: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faCircleExclamation} {...props} />
		),
		Warning: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faTriangleExclamation} {...props} />
		),
	},
	Action: {
		Create: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faPlus} {...props} />
		),
		Update: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faPenToSquare} {...props} />
		),
		Delete: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faTrashCan} {...props} />
		),
		Cancel: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faCircleXmark} {...props} />
		),
		Destroy: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faPlugCircleXmark} {...props} />
		),
		Reset: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faArrowsRotate} {...props} />
		),
		Enable: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faCircleCheck} {...props} />
		),
		Disable: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faLock} {...props} />
		),
		Restore: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faRotateLeft} {...props} />
		),
		Permissions: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faScrewdriverWrench} {...props} />
		),
		View: (props: Partial<FontAwesomeIconProps>) => (
			<AwesomeIcon icon={faEye} {...props} />
		),
	},
};

export function getActionIcon(action: string) {
	action = capitalizeFirstLetter(action);

	if (action in Icons.Action) {
		return Icons.Action[action as keyof typeof Icons.Action];
	}

	throw new Error(`${action} is not defined in Icons.Action`);
}
