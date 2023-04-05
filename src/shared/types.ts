export type AmPmType = 'am' | 'pm';

export type ClassName = string | null | undefined | (string | null | undefined)[];

export type Detail = 'hour' | 'minute' | 'second';

export type LooseValuePiece = string | Date | null;

export type LooseValue = LooseValuePiece | [LooseValuePiece, LooseValuePiece];

export type Value = Date | null;
