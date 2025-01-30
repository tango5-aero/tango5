import Link from 'next/link';
import { Button, ButtonProps } from '~/components/ui/button';

type LinkButtonProps = ButtonProps & {
    href: string;
};

export const LinkButton = (props: LinkButtonProps) => {
    if (props.disabled) {
        return <Button {...props} disabled />;
    }

    return (
        <Button asChild {...props}>
            <Link href={props.href}>{props.children}</Link>
        </Button>
    );
};
