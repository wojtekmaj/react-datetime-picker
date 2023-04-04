export type Detail = 'hour' | 'minute' | 'second';

type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | [LooseValuePiece, LooseValuePiece];
