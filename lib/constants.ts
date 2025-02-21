export const cacheTags = {
    userGames: 'usergames',
    scenarios: 'scenarios',
    users: 'users'
};

export const GAME_INDICATOR_SIZE = 60;
export const GAME_INDICATOR_STROKE_WIDTH = 6;
export const GAME_INDICATOR_TRAIL_STROKE_WIDTH = 2;
export const GAME_TIMEOUT_MS = 30_000;
export const GAME_MAX_SCENARIOS_IN_A_ROW = 5;
export const GAME_COUNTDOWN_DURATION = 3;

export const MAP_SOURCE_ID = 'scenario-source';

export const TIME_TO_REMOVE_FAILED_PAIRS_MS = 5000;

export const BREAKPOINT_SMALL_SCREEN = 1024;

export const MAP_PADDING = 0.18;

export const posthogEvents = {
    gameStart: 'game_start',
    gameFinish: 'game_finish',
    demoStart: 'demo_start',
    demoFinish: 'demo_finish'
} as const;
