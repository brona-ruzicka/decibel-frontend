
export interface SoundData {
  file: string
  size: number
  name: string
  group: string
}


export type SoundId = string

export interface Sound {
  id: SoundId
  url: string
  size: number
  name: string
  group: string
}

export interface SelectedSound extends Sound {
  selected: boolean
}



export interface Group {
  name: string
  sounds: Sound[]
}

export type GroupSelected = "all" | "some" | "none";

export interface SelectedGroup extends Group {
  sounds: SelectedSound[]
  selected: GroupSelected
}
