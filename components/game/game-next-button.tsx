import { PropsWithChildren } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

type GameNextButtonProps = {
    disabled: boolean;
    loading: boolean;
    loadingText: string;
    className?: string;
    onClick: () => void;
};

export const GameNextButton = (props: PropsWithChildren<GameNextButtonProps>) => {
    return (
        <Button
            variant="map"
            size="map"
            disabled={props.disabled || props.loading}
            className={cn(props.className)}
            onClick={props.onClick}>
            {props.loading && <Loader2 className="animate-spin" />}
            {props.loading ? props.loadingText : props.children}
        </Button>
    );
};
