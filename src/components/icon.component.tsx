import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
import {
    faBars, faCircleCheck, faCircleXmark, faClock, faMoon, faSun, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export function AwesomeIcon({ className = 'w-5 h-5', ...props }: FontAwesomeIconProps) {
    return <FontAwesomeIcon className={className} {...props} />;
}

export const Icons = {
    Error: (props: Partial<FontAwesomeIconProps>) => (
        <AwesomeIcon icon={faTriangleExclamation} {...props} />
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
        )
    }
};