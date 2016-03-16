import * as users from './users.consts';

export const GUEST = 'anonim';

export const ADMIN = [users.ADMIN];
export const ANONIM = [GUEST];
export const MANAGER = [users.MANAGER];
export const USER = [users.ADMIN, users.USER, users.MANAGER];
export const PUBLIC = [users.ADMIN, users.USER, users.MANAGER, GUEST];