import { IErrorsResponse } from "../../ui/ErrorUtils";
import { ISearchSettings } from "../../ui/KeySearchSettings";
import { API } from "./API";
import { APIUtils } from "./APIUtils";
import { ILanguage } from "./LanguagesAPI";
import { ITranslation } from "./TranslationsAPI";

export interface IKey {
    id: string;
    type: "key";
    attributes: {
        id: string;
        project_id: string;
        name: string;
        description: string | null;
        html_enabled: boolean;
        pluralization_enabled: boolean;
        name_editable: boolean;
        created_at: string;
        updated_at: string;
    };
    relationships: {
        translations: {
            data: { id: string; type: "translation" }[];
        };
        tags: { data: { id: string; type: "tag" }[] };
        wordpress_contents: { data: { id: string; type: "wordpress_content" }[] };
    };
}

export interface IGetKeysResponse {
    data: IKey[];
    included: (ITranslation | ILanguage)[];
    meta: { total: number };
}

export interface IPlaceholder {
    id: string;
    type: "placeholder";
    attributes: {
        id: string;
        name: string;
    };
}

export interface IGetKeyResponse {
    data: IKey;
    included: (ITranslation | ILanguage | IPlaceholder)[];
    meta: { total: number };
}

export interface ICreateKeyResponse {
    data: IKey;
    included: (ITranslation | ILanguage | IPlaceholder)[];
    errors: IErrorsResponse;
}

export interface IGetKeysOptions {
    search?: string;
    page?: number;
    perPage?: number;
    searchSettings?: ISearchSettings;
}

const KeysAPI = {
    getKey: async (projectId: string, keyId: string): Promise<IGetKeyResponse> => {
        return API.getRequest(`projects/${projectId}/keys/${keyId}`, true, {})
            .then(APIUtils.handleErrors)
            .catch(APIUtils.handleErrors);
    },

    getKeys: async (projectId: string, options: IGetKeysOptions): Promise<IGetKeysResponse> => {
        return API.getRequest(`projects/${projectId}/keys`, true, {
            search: (options && options.search) || undefined,
            page: options && options.page,
            per_page: options && options.perPage,
            match: options && options.searchSettings && options.searchSettings.match,
            case_sensitive: options && options.searchSettings && options.searchSettings.checkCase,
            only_untranslated: options && options.searchSettings && options.searchSettings.showOnlyUntranslated,
            only_html_enabled: options && options.searchSettings && options.searchSettings.onlyHTMLEnabled,
            only_with_overwrites:
                options && options.searchSettings && options.searchSettings.showOnlyKeysWithOverwrites,
            changed_before: options && options.searchSettings && options.searchSettings.changedBefore,
            changed_after: options && options.searchSettings && options.searchSettings.changedAfter,
            language_ids: options && options.searchSettings && options.searchSettings.languageIds,
            export_config_ids: options && options.searchSettings && options.searchSettings.exportConfigIds
        })
            .then(APIUtils.handleErrors)
            .catch(APIUtils.handleErrors);
    },

    createKey: async (options: {
        projectId: string;
        name: string;
        description: string;
        htmlEnabled: boolean;
        pluralizationEnabled: boolean;
    }): Promise<ICreateKeyResponse> => {
        return API.postRequest(`projects/${options.projectId}/keys`, true, {
            name: options.name,
            description: options.description,
            html_enabled: options.htmlEnabled,
            pluralization_enabled: options.pluralizationEnabled
        })
            .then(APIUtils.handleErrors)
            .catch(APIUtils.handleErrors);
    },

    update: async (options: {
        projectId: string;
        keyId: string;
        name: string;
        description: string;
        htmlEnabled: boolean;
        pluralizationEnabled: boolean;
    }) => {
        return API.putRequest(`projects/${options.projectId}/keys/${options.keyId}`, true, {
            name: options.name,
            description: options.description,
            html_enabled: options.htmlEnabled,
            pluralization_enabled: options.pluralizationEnabled
        })
            .then(APIUtils.handleErrors)
            .catch(APIUtils.handleErrors);
    },

    deleteKeys: async (projectId: string, keys: any) => {
        return API.deleteRequest(`projects/${projectId}/keys`, true, {
            keys: keys
        })
            .then(APIUtils.handleErrors)
            .catch(APIUtils.handleErrors);
    },

    getActivity: async (options: { projectId: string; keyId: string }) => {
        return API.getRequest(`projects/${options.projectId}/keys/${options.keyId}/activity`, true, {})
            .then(APIUtils.handleErrors)
            .catch(APIUtils.handleErrors);
    }
};

export { KeysAPI };
