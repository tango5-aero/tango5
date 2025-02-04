import { PropsWithoutRef, startTransition } from 'react';
import { Checkbox } from '../ui/checkbox';
import { changeScenarioVisibility } from '~/lib/actions';
import { useTableContext } from '~/hooks/use-table-context';
import { useDialogAction } from '~/hooks/use-dialog-action';
import { cacheTags } from '~/lib/constants';

export const ScenarioActiveCheckbox = (props: PropsWithoutRef<{ id: number; checked: boolean }>) => {
    const { forceRefresh } = useTableContext();
    const { action } = useDialogAction(
        `Changing visibility for scenario #${props.id}`,
        changeScenarioVisibility,
        cacheTags.scenarios
    );

    const handleChange = () => {
        startTransition(async () => {
            action({ id: props.id, active: !props.checked });
            forceRefresh();
        });
    };

    return <Checkbox id={props.id.toFixed()} checked={props.checked} onCheckedChange={handleChange} />;
};
