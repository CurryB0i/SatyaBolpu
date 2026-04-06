import { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { CardType } from "../components/CardList";

export type Image = {
  src: string;
  alt: string;
};

export type ButtonProps = {
  content: string;
  className?: string;
  index?: number;
  ref?: React.RefObject<HTMLButtonElement[]> | React.RefObject<HTMLButtonElement>;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  theme?: "light" | "dark";
  loading?: boolean;
  loadingText?: string;
};

export type CardProps = {
  id: string;
  title: string;
  images: string[];
  description: string;
  route: string;
};

export type CardListProps = {
  cardType: CardType,
  cardsDataList: CardProps[],
  loading: boolean,
  orientation: 'row' | 'column',
  cardsPerPage: number
};

export type FormFieldOption = {
  value: string | number;
  label: string;
};

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file' | 'url' | 'number' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  accept?: string;
  rows?: number;
  min?: number;
  max?: number;
  validation?: (value: any) => string | null;
  disabled?: boolean;
};

export type FormProps = {
  onClose: () => void;
  title: string;
  fields: FormField[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  loading?: boolean;
  submitText?: string;
  loadingText?: string;
  className?: string;
  formClassName?: string;
};

export type MapComponentProps = {
  children?: ReactNode;
  className?: string;
  geoJsonData?: { [key: string]: any };
  onMapReady?: (map: Map) => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  lock?: boolean;
  onLockChange?: (locked: boolean) => void;
  showControls?: boolean;
  center?: LatLngExpression;
  maxBounds?: LatLngBoundsExpression;
  minZoom?: number;
  initialZoom?: number;
  ref?: React.RefObject<HTMLDivElement | null>;
  gestureHandling?: boolean;
};

export type User = {
  id: string;
  name: string;
  uname: string;
  email: string;
  phone: {
    dialCode: string;
    number: string;
  } | null;
  role: 'user' | 'admin';
  verified: boolean;
};

export type Location = {
  district: string;
  taluk?: string;
  village: string;
  lat: number | null;
  lng: number | null;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isRefreshing: boolean;
};

export type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REFRESH_FAILED' };

export type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

export type CultureType = "daivaradhane" | "nagaradhane" | "kambala" | "yakshagana";

export type CultureDetailsType = {
  name: string;
  descriptiveName: string;
  description: string;
  coverImages: string[] | File[] | number[];
  galleryImages: string[] | File[] | number[];
};

export type CultureState = {
  details: CultureDetailsType | null;
  content: string; 
};

export type CultureAction = 
  | { type: 'SAVE_CULTURE_DETAILS', payload: { details: CultureDetailsType }  }
  | { type: 'CLEAR_CULTURE_DETAILS' }
  | { type: 'SAVE_EDITOR_CONTENT', payload: { content: string } }
  | { type: 'CLEAR_EDITOR_CONTENT' }
  | { type: 'CLEAR_CULTURE' };

export type CultureDispatch = React.Dispatch<CultureAction>;

export type CultureContextType = {
  state: CultureState;
  dispatch: CultureDispatch;
};

export type DialogBoxOptions = {
    title: string;
    description?: string;
    severity?: "irreversible" | "risky" | "default";
    form?: FormProps;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export type DialogBoxContextType = {
    popup: (options: DialogBoxOptions) => void;
};

export type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export type PostDetailsType = {
  mainTitle: string;
  shortTitle: string;
  culture: CultureType | null;
  description: string;
  tags: string[];
  locationSpecific: boolean;
  image: File | number | string | null;
};

export type PostState = {
  details: PostDetailsType | null;
  content: string;
  location: Location | null;
};

export type PostAction =
  | { type: 'SAVE_POST_DETAILS' , payload: { details: PostDetailsType } }
  | { type: 'CLEAR_POST_DETAILS' }
  | { type: 'SAVE_EDITOR_CONTENT', payload: { content: string } }
  | { type: 'CLEAR_EDITOR_CONTENT' }
  | { type: 'SAVE_LOCATION', payload: { location: Location } }
  | { type: 'CLEAR_LOCATION' }
  | { type: 'CLEAR_POST' };

export type PostDispatch = React.Dispatch<PostAction>;

export type PostContextType = {
  state: PostState;
  dispatch: PostDispatch;
};

export type EventDetailsType = {
  name: string;
  description: string;
  duration: {
    start: Date | null,
    end: Date | null
  },
  culture: CultureType | null;
  docs: string[] | File[] | number[]
}

export type EventState = {
  details: EventDetailsType | null;
  location: Location | null;
};

export type EventAction =
  | { type: 'SAVE_EVENT_DETAILS' , payload: { details: EventDetailsType } }
  | { type: 'CLEAR_EVENT_DETAILS' }
  | { type: 'SAVE_LOCATION', payload: { location: Location } }
  | { type: 'CLEAR_LOCATION' }
  | { type: 'CLEAR_EVENT' }

export type EventDispatch = React.Dispatch<EventAction>;

export type EventContextType = {
  state: EventState;
  dispatch: EventDispatch;
};

export type Entity = "culture" | "post" | "event";

export type ImageType = "editor" | "details";

export type SignUpProps = {
  name: string;
  uname: string;
  email: string;
  phone?: {
    dialCode: string;
    number: string;
  } | string;
  password: string;
  confirmPassword: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export interface ICulture {
  name: string;
  descriptiveName: string;
  description: string;
  coverImages: string[];
  galleryImages: string[];
  content: string;
  posts: number;
};

export interface ILocation {
  district: string;
  taluk: string;
  village: string;
  lat: number;
  lng: number;
};

export interface IPost {
  mainTitle: string;
  shortTitle: string;
  culture: string;
  description: string;
  tags: string[];
  image: string;
  content: string;
  location?: ILocation;
};

export interface IEvent {
  name: string;
  description: string;
  duration: {
    start: Date,
    end: Date
  };
  culture: string;
  docs: string[];
  location: ILocation
};
