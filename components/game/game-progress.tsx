'use client';

import * as React from 'react';
import { PropsWithoutRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type GameProgressProps = {
    progress: number;
    total: number;
    isGameOver: boolean;
    success: boolean;
};

const GameProgress = (props: PropsWithoutRef<GameProgressProps>) => {
    return (
        <div className="fixed left-16 top-5 z-10 select-none text-lg text-secondary transition-all hover:scale-110 dark:text-primary">
            <CircularProgressWithLabel
                progress={props.progress}
                total={props.total}
                isGameOver={props.isGameOver}
                success={props.success}
            />
        </div>
    );
};

function CircularProgressWithLabel(props: GameProgressProps) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                color={props.isGameOver && !props.success ? 'error' : 'success'}
                value={Math.round(100 * (props.progress / props.total))}
                size="60px"
                thickness={5}
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Typography
                    className="select-none text-lg text-secondary dark:text-primary"
                    component="div"
                    sx={{ color: 'white' }}>{`${props.progress}/${props.total}`}</Typography>
            </Box>
        </Box>
    );
}

export { GameProgress };
