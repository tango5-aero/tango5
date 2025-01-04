'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '~/hooks/use-toast';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from './ui/input';
import { flightSchema } from '../data/scripts/new-model';

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

        const parse = flightSchema.array().safeParse(contents);

        return parse.success;
    }, 'The file does not contain valid scenario data.'),
    name: z.string().nonempty('Name is required')
});

export function TextareaForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log('Submitted:', data);

        const file = data.file.item(0)!;

        // FIXME: remove console.log and fix toast not working
        file.text().then(console.log);

        toast({
            title: 'Submission Successful',
            description: `You submitted: ${data.name}`
        });

        // TODO: check and upload the scenario to the database
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                {/* Controlled Textarea */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Scenario name" className="resize-none" {...field} />
                            </FormControl>
                            <FormDescription>Give the scenario a name, this is what the user will see.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Uncontrolled File Input */}
                <FormItem>
                    <FormLabel>Upload scenario data</FormLabel>
                    <FormControl>
                        <Input
                            className="border"
                            type="file"
                            accept="application/json"
                            {...form.register('file', {
                                required: 'A file is required',
                                validate: (value) => {
                                    if (!value || value.length !== 1) {
                                        return 'One file is required';
                                    }

                                    return true;
                                }
                            })}
                        />
                    </FormControl>
                    <FormDescription>Upload a file containing scenario data</FormDescription>
                    <FormMessage />
                </FormItem>

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
