import { CategoryTypes } from './categories.types';
import { SubCategoryTypes } from './categories.types';
import { IUser } from './user.types';

export interface NewsletterType {
  id: string;
  category: CategoryTypes;
  subCategory: SubCategoryTypes;
  title: string;
  userType: string;
  status: 'draft' | 'sent';
  createdAt: Date;
  subject: string;
  content: string;
  sentBy: IUser;
}

export interface NewsletterDataType {
  doc: NewsletterType[];
}
