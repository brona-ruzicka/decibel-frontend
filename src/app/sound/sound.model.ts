export interface SoundData {
  file: string;
  size: number;
  name: string;
  group: string;
}


export type SoundId = string

export interface Sound {
  id: SoundId;
  url: string;
  size: number;
  name: string;
  group: string;
}

export interface SoundWithSelection extends Sound {
  selected: boolean;
}


export interface Group {
  name: string;
  sounds: Sound[];
}

export type GroupSelection = 'all' | 'some' | 'none';

export interface GroupWithSelection extends Group {
  sounds: SoundWithSelection[];
  selected: GroupSelection;
}
