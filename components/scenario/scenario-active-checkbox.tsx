import { PropsWithoutRef, startTransition } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useDialogAction } from '~/hooks/use-dialog-action';
import { changeScenarioVisibility } from '~/lib/actions';
import { cacheTags } from '~/lib/constants';
import { Checkbox } from '~/components/ui/checkbox';

export const ScenarioActiveCheckbox = (props: PropsWithoutRef<{ id: number; checked: boolean }>) => {
    const { action } = useDialogAction(
        `Changing visibility for scenario #${props.id}`,
        changeScenarioVisibility,
        cacheTags.scenarios
    );

    const handleChange = (active: CheckedState) => {
        if (active === 'indeterminate') return;
        startTransition(async () => {
            action({ id: props.id, active });
        });
    };

    return <Checkbox defaultChecked={props.checked} onCheckedChange={handleChange} />;
};
