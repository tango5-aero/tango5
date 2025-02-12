import { PropsWithoutRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

type GameNextButtonProps = {
    disabled: boolean;
    loading: boolean;
    className?: string;
    onClick: () => void;
};

export const GameNextButton = (props: PropsWithoutRef<GameNextButtonProps>) => {
    return (
        <Button
            variant="map"
            size="map"
            disabled={props.disabled || props.loading}
            className={cn(props.className)}
            onClick={props.onClick}>
            {props.loading && <Loader2 className="animate-spin" />}
            {'Next'}
        </Button>
    );
};
