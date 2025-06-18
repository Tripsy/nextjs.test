import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
import {
    faBan,
    faBars,
    faCircleCheck,
    faCircleXmark,
    faClock,
    faMagnifyingGlass,
    faMoon, faPenToSquare,
    faPlus,
    faSun,
    faTrashCan,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export function AwesomeIcon({ className = 'w-5 h-5', ...props }: FontAwesomeIconProps) {
    return <FontAwesomeIcon className={className} {...props} />;
}

export const Icons = {
    Error: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faTriangleExclamation} {...props} />
    ),
    Search: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faMagnifyingGlass} {...props} />
    ),
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