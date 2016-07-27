import * as users from './users.consts';

export const GUEST = 'anonim';

export const ADMIN = [users.ADMIN];
export const ANONIM = [GUEST];
export const MANAGER = [users.MANAGER];
export const MANAGERS = [users.MANAGER, users.ADMIN, users.TEAMLEAD];
export const TEAMLEAD = [users.TEAMLEAD];
export const USER = [users.ADMIN, users.USER, users.MANAGER, users.TEAMLEAD];
export const PUBLIC = [users.ADMIN, users.USER, users.MANAGER, users.TEAMLEAD, GUEST];