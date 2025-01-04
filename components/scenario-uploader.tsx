'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '~/hooks/use-toast';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from './ui/input';
import { scenario } from '../lib/scenario';

const FormSchema = z.object({
    file: z.instanceof(FileList).refine(async (file) => {
        const text = await file.item(0)?.text();

        if (!text) return false;

        let contents;

        try {
            contents = JSON.parse(text);
        } catch {
            return false;
        }

        const parse = scenario.safeParse(contents);

        return parse.success;
    }, 'No file chosen or the file does not contain valid scenario data.')
});

export function TextareaForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    const fileRef = form.register('file');

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log('Submitted:', data);

        const file = data.file.item(0)!;

        // FIXME: remove console.log and fix toast not working
        file.text().then(console.log);

        toast({
            title: 'Submission Successful',
            description: `You submitted: ${data.file.item(0)?.name}`
        });

        // TODO: check and upload the scenario to the database
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                        <FormItem>
                            <FormLabel>New scenario from file</FormLabel>
                            <FormControl>
                                <Input {...fileRef} type="file" accept="application/json" />
                            </FormControl>
                            <FormDescription>{'Upload scenario data.'}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
