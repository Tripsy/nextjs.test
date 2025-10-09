import {create} from 'zustand';
import {DataSourceType} from '@/config/data-source';

interface ManageState<Model> {
    isCreateOpen: boolean;
    isUpdateOpen: boolean;
    isOperationOpen: boolean;
    entries: Model[] | [];
    isLoading: boolean;
}

type ManageAction<Model> =
    | { type: 'OPEN_CREATE' }
    | { type: 'CLOSE_CREATE' }
    | { type: 'OPEN_UPDATE'; payload: Model }
    | { type: 'CLOSE_UPDATE' }
    | { type: 'OPEN_OPERATION'; payload: Model[] }
    | { type: 'CLOSE_OPERATION' }
    | { type: 'SET_LOADING'; payload: boolean };

const manageReducer = <Model>(state: ManageState<Model>, action: ManageAction<Model>): ManageState<Model> => {
    switch (action.type) {
        case 'OPEN_CREATE':
            return {...state, isCreateOpen: true};
        case 'CLOSE_CREATE':
            return {...state, isCreateOpen: false};
        case 'OPEN_UPDATE':
            return {...state, isUpdateOpen: true, entries: [action.payload]};
        case 'CLOSE_UPDATE':
            return {...state, isUpdateOpen: false, entries: []};
        case 'OPEN_OPERATION':
            return {...state, isOperationOpen: true, entries: action.payload};
        case 'CLOSE_OPERATION':
            return {...state, isOperationOpen: false, entries: []};
        case 'SET_LOADING':
            return {...state, isLoading: action.payload};
        default:
            return state;
    }
};

export interface ManageStore<Model> extends ManageState<Model> {
    dispatch: (action: ManageAction<Model>) => void;
    openCreate: () => void;
    openUpdate: (entry: Model) => void;
    openAction: (entries: Model[]) => void;
    close: () => void;
    // createEntry: (data: Omit<T, 'id'>) => Promise<void>;
    // updateEntry: (id: number, data: Partial<T>) => Promise<void>;
    // deleteItems: (ids: (number)[]) => Promise<void>;
}

export const createManageStore = <Model>() => create<ManageStore<Model>>((set, get) => ({
    isCreateOpen: false,
    isUpdateOpen: false,
    isOperationOpen: false,
    entries: [],
    isLoading: false,

    dispatch: (action) => set((state) => manageReducer(state, action)),

    openCreate: () => get().dispatch({type: 'OPEN_CREATE'}),

    openUpdate: (entry: Model) => get().dispatch({type: 'OPEN_UPDATE', payload: entry}),

    openAction: (entries: Model[]) => get().dispatch({type: 'OPEN_OPERATION', payload: entries}),

    close: () => {
        const {dispatch} = get();

        dispatch({type: 'CLOSE_CREATE'});
        dispatch({type: 'CLOSE_UPDATE'});
        dispatch({type: 'CLOSE_OPERATION'});
    },
}));

export type ManageStoreType<K extends keyof DataSourceType> = ReturnType<typeof createManageStore<DataSourceType[K]['model']>>;