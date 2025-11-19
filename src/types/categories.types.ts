export interface CategoryTypes {
  id: string;
  name: string;
  status: boolean;
  description: string;
  createdAt: Date;
}

export interface CategoryDataTypes {
  doc: CategoryTypes[];
}

export interface SubCategoryTypes {
  id: string;
  name: string;
  status: boolean;
  description: string;
  userCategory: CategoryTypes;
  createdAt: Date;
}
export interface SubCategoryDataTypes {
  doc: SubCategoryTypes[];
}
