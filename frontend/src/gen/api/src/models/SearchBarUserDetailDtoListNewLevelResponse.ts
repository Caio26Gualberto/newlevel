/* tslint:disable */
/* eslint-disable */
/**
 * NewLevel
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { SearchBarUserDetailDto } from './SearchBarUserDetailDto';
import {
    SearchBarUserDetailDtoFromJSON,
    SearchBarUserDetailDtoFromJSONTyped,
    SearchBarUserDetailDtoToJSON,
} from './SearchBarUserDetailDto';

/**
 * 
 * @export
 * @interface SearchBarUserDetailDtoListNewLevelResponse
 */
export interface SearchBarUserDetailDtoListNewLevelResponse {
    /**
     * 
     * @type {boolean}
     * @memberof SearchBarUserDetailDtoListNewLevelResponse
     */
    isSuccess?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SearchBarUserDetailDtoListNewLevelResponse
     */
    message?: string;
    /**
     * 
     * @type {Array<SearchBarUserDetailDto>}
     * @memberof SearchBarUserDetailDtoListNewLevelResponse
     */
    data?: Array<SearchBarUserDetailDto>;
}

/**
 * Check if a given object implements the SearchBarUserDetailDtoListNewLevelResponse interface.
 */
export function instanceOfSearchBarUserDetailDtoListNewLevelResponse(value: object): boolean {
    return true;
}

export function SearchBarUserDetailDtoListNewLevelResponseFromJSON(json: any): SearchBarUserDetailDtoListNewLevelResponse {
    return SearchBarUserDetailDtoListNewLevelResponseFromJSONTyped(json, false);
}

export function SearchBarUserDetailDtoListNewLevelResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchBarUserDetailDtoListNewLevelResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'isSuccess': json['isSuccess'] == null ? undefined : json['isSuccess'],
        'message': json['message'] == null ? undefined : json['message'],
        'data': json['data'] == null ? undefined : ((json['data'] as Array<any>).map(SearchBarUserDetailDtoFromJSON)),
    };
}

export function SearchBarUserDetailDtoListNewLevelResponseToJSON(value?: SearchBarUserDetailDtoListNewLevelResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'isSuccess': value['isSuccess'],
        'message': value['message'],
        'data': value['data'] == null ? undefined : ((value['data'] as Array<any>).map(SearchBarUserDetailDtoToJSON)),
    };
}

