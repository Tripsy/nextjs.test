import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
import {
    faArrowRightToBracket,
    faBan,
    faBars,
    faCircleCheck,
    faCircleXmark,
    faClock, faEnvelope, faEye, faEyeSlash, faKey,
    faMagnifyingGlass,
    faMoon, faPenToSquare,
    faPlus, faSpinner,
    faSun,
    faTrashCan,
    faTriangleExclamation, faUser, faUserCheck
} from '@fortawesome/free-solid-svg-icons';

export function AwesomeIcon({ className = 'w-5 h-5', ...props }: FontAwesomeIconProps) {
    return <FontAwesomeIcon className={className} {...props} />;
}

export const Icons = {
    SideMenuOpen: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faBars} {...props} />
    ),
    SideMenuClosed: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faBars} {...props} />
    ),
    ToggleThemeDay: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faSun} {...props} />
    ),
    ToggleThemeNight: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faMoon} {...props} />
    ),
    Spinner: (props: Partial<FontAwesomeIconProps>) => (
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
        <AwesomeIcon icon={faTriangleExclamation} {...props} />
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
            <AwesomeIcon icon={faCircleXmark} {...props} />
        ),
        Deleted: (props: Partial<FontAwesomeIconProps>) => (
            <AwesomeIcon icon={faBan} {...props} />
        )
    },
    Action: {
        Add: (props: Partial<FontAwesomeIconProps>)=> (
            <AwesomeIcon icon={faPlus} {...props} />
        ),
        Edit: (props: Partial<FontAwesomeIconProps>) => (
            <AwesomeIcon icon={faPenToSquare} {...props} />
        ),
        Delete: (props: Partial<FontAwesomeIconProps>) => (
            <AwesomeIcon icon={faTrashCan} {...props} />
        )
    }
};